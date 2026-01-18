import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';

// --- Types ---
export interface UserProfile {
    username: string;
    bio: string;
    role: string;
    currentlyBuilding?: string;
    techStack: string[];
    email?: string | null;
    avatarUrl?: string;
    socials?: {
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        website?: string;
        github?: string;
    };
    stats?: {
        reach?: string;
    };
    following?: string[];
    phase?: string;
    githubConfig?: {
        repo?: string; // "owner/repo"
        token?: string;
    };
}

export interface ActivityItem {
    id: string;
    type: 'commit' | 'task' | 'note' | 'milestone';
    source: string;
    title: string;
    desc?: string;
    time: string;
    details?: string;
    created_at?: string; // Internal for sorting
}

export interface IdeaItem {
    id: string;
    title: string;
    desc: string;
    tags: string[];
    date: string;
    createdAt?: any;
}

export interface DraftItem {
    id: string;
    type: string;
    title: string;
    status: 'Ready' | 'Draft' | 'Scripted' | 'Published';
    platform: string;
    content?: string;
    createdAt?: any;
}

interface AtumState {
    userProfile: UserProfile | null;
    activityLog: ActivityItem[];
    ideas: IdeaItem[];
    drafts: DraftItem[];
    communityUpdates: any[];
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;

    fetchData: () => Promise<void>;

    addActivity: (item: Omit<ActivityItem, 'id' | 'time'>) => Promise<void>;
    addIdea: (item: Omit<IdeaItem, 'id' | 'date'>) => Promise<void>;
    deleteIdea: (id: string) => Promise<void>;
    addDraft: (draft: Omit<DraftItem, 'id'>) => Promise<void>;
    updateDraft: (id: string, updates: Partial<DraftItem>) => Promise<void>;
    updateProfile: (profile: UserProfile) => Promise<void>;
    followUser: (targetId: string) => Promise<void>;
    unfollowUser: (targetId: string) => Promise<void>;
    fetchCommunity: () => Promise<void>;
    fetchGitHubCommits: () => Promise<void>;
    deleteActivity: (id: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAtumStore = create<AtumState>((set, get) => ({
    activityLog: [],
    ideas: [],
    drafts: [],
    communityUpdates: [],
    userProfile: null,
    isInitialized: false,
    isLoading: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = auth.currentUser;
            if (!user) {
                set({ activityLog: [], ideas: [], drafts: [], userProfile: null, isInitialized: true, isLoading: false });
                return;
            }

            const [ideasSnap, draftsSnap, profileSnap, activitySnap] = await Promise.all([
                getDocs(query(collection(db, "ideas"), where("userId", "==", user.uid))),
                getDocs(query(collection(db, "drafts"), where("userId", "==", user.uid))),
                getDoc(doc(db, "profiles", user.uid)),
                getDocs(query(collection(db, "activity"), where("userId", "==", user.uid))) // "activity" collection seems to be used in addActivity
            ]);

            set({
                ideas: ideasSnap.docs.map(d => ({ ...d.data(), id: d.id, desc: d.data().description, date: d.data().createdAt?.toDate().toLocaleDateString() || 'Just now' } as IdeaItem)),
                drafts: draftsSnap.docs.map(d => ({ ...d.data(), id: d.id } as DraftItem)),
                userProfile: profileSnap.exists() ? profileSnap.data() as UserProfile : null,
                activityLog: activitySnap.docs.map(d => {
                    const data = d.data();
                    return {
                        ...data,
                        id: d.id,
                        time: data.createdAt?.toDate?.().toLocaleDateString() || 'Just now',
                        desc: data.description,
                        // Ensure required fields are present to satisfy ActivityItem
                        type: data.type || 'note',
                        source: data.source || 'system',
                        title: data.title || 'Untitled'
                    } as ActivityItem;
                }).sort((_a, _b) => {
                    return 0;
                }),
                isInitialized: true,
                isLoading: false
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            set({ error: "Failed to load data.", isLoading: false, isInitialized: true });
        }
    },

    addActivity: async (item) => {
        const user = auth.currentUser;
        if (!user) return;

        await addDoc(collection(db, "activity"), {
            userId: user.uid,
            title: item.title,
            type: item.type,
            source: item.source,
            description: item.desc,
            createdAt: serverTimestamp()
        });

        await get().fetchData();
    },

    deleteActivity: async (id) => {
        try {
            await deleteDoc(doc(db, "activity", id));
            set(state => ({
                activityLog: state.activityLog.filter(item => item.id !== id)
            }));
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    },

    addIdea: async (item) => {
        const user = auth.currentUser;
        if (!user) return;

        await addDoc(collection(db, "ideas"), {
            userId: user.uid,
            title: item.title,
            description: item.desc,
            tags: item.tags,
            createdAt: serverTimestamp()
        });

        // Auto-log activity
        await get().addActivity({
            type: 'note',
            source: 'Idea Bank',
            title: 'New Idea Captured',
            desc: item.title
        });

        await get().fetchData();
    },

    deleteIdea: async (id) => {
        await deleteDoc(doc(db, "ideas", id));
        set(state => ({
            ideas: state.ideas.filter(i => i.id !== id)
        }));
    },

    addDraft: async (draft) => {
        const user = auth.currentUser;
        if (!user) return;

        await addDoc(collection(db, "drafts"), {
            userId: user.uid,
            title: draft.title,
            type: draft.type,
            platform: draft.platform,
            status: draft.status,
            content: draft.content,
            createdAt: serverTimestamp()
        });

        // Auto-log activity
        await get().addActivity({
            type: 'task',
            source: 'Publisher',
            title: 'Draft Created',
            desc: `${draft.title} (${draft.platform})`
        });

        await get().fetchData();
    },

    updateDraft: async (id, updates) => {
        const draftRef = doc(db, "drafts", id);
        await setDoc(draftRef, { ...updates }, { merge: true });

        // Optimistic update
        set(state => ({
            drafts: state.drafts.map(d => d.id === id ? { ...d, ...updates } : d)
        }));

        // Log significant status changes
        if (updates.status && updates.status === 'Published') {
            const draft = get().drafts.find(d => d.id === id);
            if (draft) {
                await get().addActivity({
                    type: 'milestone',
                    source: 'Publisher',
                    title: 'Content Published',
                    desc: `Published "${draft.title}" to ${draft.platform}`
                });
            }
        }
    },

    updateProfile: async (profile) => {
        const user = auth.currentUser;
        if (!user) return;

        const profileRef = doc(db, "profiles", user.uid);
        await setDoc(profileRef, {
            ...profile,
            phase: profile.phase || "Phase 1: Stealth Build",
            email: user.email,
            updatedAt: serverTimestamp()
        }, { merge: true });

        set({ userProfile: { ...profile, email: user.email } as UserProfile });

        // Auto-log activity
        await get().addActivity({
            type: 'note',
            source: 'System',
            title: 'Profile Updated',
            desc: 'User profile details updated'
        });
    },

    followUser: async (targetId: string) => {
        const user = auth.currentUser;
        const profile = get().userProfile;
        if (!user || !profile) return;

        const currentFollowing = profile.following || [];
        if (currentFollowing.includes(targetId)) return;

        const newFollowing = [...currentFollowing, targetId];

        // Update local
        set({ userProfile: { ...profile, following: newFollowing } });

        // Update Firestore
        const profileRef = doc(db, "profiles", user.uid);
        await setDoc(profileRef, { following: newFollowing }, { merge: true });

        // Log it
        await get().addActivity({
            type: 'milestone',
            source: 'Community',
            title: 'Joined Community',
            desc: `Started following a new builder.`
        });
    },

    unfollowUser: async (targetId: string) => {
        const user = auth.currentUser;
        const profile = get().userProfile;
        if (!user || !profile) return;

        const currentFollowing = profile.following || [];
        const newFollowing = currentFollowing.filter(id => id !== targetId);

        // Update local
        set({ userProfile: { ...profile, following: newFollowing } });

        // Update Firestore
        const profileRef = doc(db, "profiles", user.uid);
        await setDoc(profileRef, { following: newFollowing }, { merge: true });
    },

    fetchCommunity: async () => {
        set({ isLoading: true });
        try {
            // Note: In Firestore, != and orderBy can create composite index requirements
            // For MVP, simple fetch
            const q = query(collection(db, "profiles"), where("username", "!=", ""));
            const querySnapshot = await getDocs(q);
            const profiles = querySnapshot.docs.map(d => d.data() as UserProfile).slice(0, 20);

            set({
                communityUpdates: profiles.map(u => ({
                    id: Math.random().toString(36).substring(7),
                    user: u.username,
                    action: `joined as ${u.role}`,
                    time: 'Just now',
                    role: u.role
                })),
                isLoading: false
            });
        } catch (e) {
            console.error(e);
            set({ isLoading: false });
        }
    },

    fetchGitHubCommits: async () => {
        const profile = get().userProfile;
        if (!profile?.githubConfig?.repo) return;

        const { repo, token } = profile.githubConfig;
        try {
            const headers: HeadersInit = {
                'Accept': 'application/vnd.github.v3+json'
            };
            if (token) {
                headers['Authorization'] = `token ${token}`;
            }

            const response = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=10`, { headers });
            if (!response.ok) throw new Error('Failed to fetch commits');

            const data = await response.json();

            const newCommits: ActivityItem[] = data.map((commit: any) => ({
                id: `gh-${commit.sha.substring(0, 7)}`,
                type: 'commit',
                source: 'GitHub',
                title: commit.commit.message.split('\n')[0],
                desc: `Commit by ${commit.commit.author.name}`,
                time: new Date(commit.commit.author.date).toLocaleDateString(),
                details: commit.html_url,
                created_at: commit.commit.author.date // For sorting if needed
            }));

            // Merge and deduplicate
            set(state => {
                const existingIds = new Set(state.activityLog.map(i => i.id));
                const uniqueNew = newCommits.filter(c => !existingIds.has(c.id));
                if (uniqueNew.length === 0) return {};

                return {
                    activityLog: [...uniqueNew, ...state.activityLog].sort((_a, _b) => {
                        // Simple string compare or date parse if needed, for MVP just placing new ones top
                        return 0;
                    })
                };
            });

        } catch (error) {
            console.error("GitHub Sync Error:", error);
            // Optional: set specific error state
        }
    },

    signOut: async () => {
        await auth.signOut();
        set({
            userProfile: null,
            activityLog: [],
            ideas: [],
            drafts: [],
            isInitialized: false
        });
    }
}));
