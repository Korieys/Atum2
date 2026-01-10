import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';

// --- Types ---
export interface UserProfile {
    username: string;
    bio: string;
    role: string;
    techStack: string[];
    email?: string | null;
    avatarUrl?: string;
    socials?: {
        twitter?: string;
        linkedin?: string;
        youtube?: string;
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
    fetchCommunity: () => Promise<void>;
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
                }).sort((a, b) => {
                    if (!a.created_at || !b.created_at) return 0;
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
                    id: crypto.randomUUID(),
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
    }
}));
