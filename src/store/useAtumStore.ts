import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { useNotificationStore } from './useNotificationStore';

// --- Types ---
export interface UserProfile {
    id?: string;
    username: string;
    bio: string;
    role: string;
    banner?: string; // CSS class or URL
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
    friends?: string[];
    friendRequests?: FriendRequest[];
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
    banner?: string;
    myTribes?: string[];
    friends?: string[]; // IDs of accepted friends
    content?: string;
    createdAt?: any;
}

export interface Tribe {
    id: string;
    name: string;
    description: string;
    banner: string;
    members: string[]; // User IDs
    createdBy: string;
    createdAt: Date;
}

export interface TribePost {
    id: string;
    tribeId: string;
    authorId: string;
    authorName: string;
    content: string;
    likes: string[];
    createdAt: string; // "2h ago"
}

export interface FriendRequest {
    id: string;
    fromId: string;
    toId: string;
    status: 'pending' | 'accepted' | 'rejected';
}

export interface Message {
    id: string;
    fromId: string;
    toId: string;
    content: string;
    createdAt: Date;
}

interface AtumState {
    userProfile: UserProfile | null;
    activityLog: ActivityItem[];
    ideas: IdeaItem[];
    drafts: DraftItem[];
    communityUpdates: UserProfile[]; // Now storing real profiles for "Builders" list
    tribes: Tribe[];
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
    // --- TRIBES SYSTEM ---
    tribePosts: TribePost[];
    friendRequests: FriendRequest[];
    messages: Message[];

    fetchTribes: () => Promise<void>;
    createTribe: (tribe: Omit<Tribe, 'id' | 'members' | 'createdBy'>) => Promise<void>;
    joinTribe: (tribeId: string) => Promise<void>;
    leaveTribe: (tribeId: string) => Promise<void>;

    // Posts
    fetchTribePosts: (tribeId: string) => Promise<void>;
    createTribePost: (tribeId: string, content: string) => Promise<void>;

    // Friends & Messaging
    sendFriendRequest: (toUserId: string) => Promise<void>;
    acceptFriendRequest: (requestId: string) => Promise<void>;
    rejectFriendRequest: (requestId: string) => Promise<void>;
    sendMessage: (toUserId: string, content: string) => Promise<void>;
    removeFriend: (friendId: string) => Promise<void>;

    // Community
    fetchCommunity: () => Promise<void>;
    followUser: (userId: string) => Promise<void>;
    unfollowUser: (userId: string) => Promise<void>;
    fetchGitHubCommits: () => Promise<void>;
    deleteActivity: (id: string) => Promise<void>;
    signOut: () => Promise<void>;
}

// Mock Data (assuming these are defined elsewhere or will be added)
const MOCK_ACTIVITY_LOG: ActivityItem[] = [];
const MOCK_IDEAS: IdeaItem[] = [];
const MOCK_DRAFTS: DraftItem[] = [];
const MOCK_TRIBES: Tribe[] = [];


export const useAtumStore = create<AtumState>((set, get) => ({
    // ... (Existing initial state)
    userProfile: null,
    activityLog: MOCK_ACTIVITY_LOG,
    drafts: MOCK_DRAFTS,
    ideas: MOCK_IDEAS,
    tribes: MOCK_TRIBES, // We'll keep using mock tribes for now until DB is fully ready
    tribePosts: [],
    friendRequests: [],
    messages: [],
    communityUpdates: [],

    isLoading: false,
    isInitialized: false,
    error: null,

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = auth.currentUser;
            if (!user) {
                set({ activityLog: [], ideas: [], drafts: [], tribes: [], userProfile: null, isInitialized: true, isLoading: false });
                return;
            }

            const [ideasSnap, draftsSnap, profileSnap, activitySnap, tribesSnap] = await Promise.all([
                getDocs(query(collection(db, "ideas"), where("userId", "==", user.uid))),
                getDocs(query(collection(db, "drafts"), where("userId", "==", user.uid))),
                getDoc(doc(db, "profiles", user.uid)),
                getDocs(query(collection(db, "activity"), where("userId", "==", user.uid))),
                getDocs(collection(db, "tribes"))
            ]);

            set({
                ideas: ideasSnap.docs.map(d => ({ ...d.data(), id: d.id, desc: d.data().description, date: d.data().createdAt?.toDate().toLocaleDateString() || 'Just now' } as IdeaItem)),
                drafts: draftsSnap.docs.map(d => ({ ...d.data(), id: d.id } as DraftItem)),
                userProfile: profileSnap.exists() ? { ...profileSnap.data(), id: profileSnap.id } as unknown as UserProfile : null,
                activityLog: activitySnap.docs.map(d => {
                    const data = d.data();
                    return {
                        ...data,
                        id: d.id,
                        time: data.createdAt?.toDate?.().toLocaleDateString() || 'Just now',
                        desc: data.description,
                        type: data.type || 'note',
                        source: data.source || 'system',
                        title: data.title || 'Untitled'
                    } as ActivityItem;
                }),
                tribes: tribesSnap.docs.map(t => ({ ...t.data(), id: t.id } as Tribe)),
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
        await addDoc(collection(db, "activity"), { userId: user.uid, title: item.title, type: item.type, source: item.source, description: item.desc, createdAt: serverTimestamp() });
        await get().fetchData();
    },

    deleteActivity: async (id) => {
        try { await deleteDoc(doc(db, "activity", id)); set(state => ({ activityLog: state.activityLog.filter(item => item.id !== id) })); } catch (error) { console.error("Error deleting activity:", error); }
    },

    addIdea: async (item) => {
        const user = auth.currentUser;
        if (!user) return;
        await addDoc(collection(db, "ideas"), { userId: user.uid, title: item.title, description: item.desc, tags: item.tags, createdAt: serverTimestamp() });
        await get().addActivity({ type: 'note', source: 'Idea Bank', title: 'New Idea Captured', desc: item.title });
        await get().fetchData();
    },

    deleteIdea: async (id) => {
        await deleteDoc(doc(db, "ideas", id));
        set(state => ({ ideas: state.ideas.filter(i => i.id !== id) }));
    },

    addDraft: async (draft) => {
        const user = auth.currentUser;
        if (!user) return;
        await addDoc(collection(db, "drafts"), { userId: user.uid, title: draft.title, type: draft.type, platform: draft.platform, status: draft.status, content: draft.content, createdAt: serverTimestamp() });
        await get().addActivity({ type: 'task', source: 'Publisher', title: 'Draft Created', desc: `${draft.title} (${draft.platform})` });
        await get().fetchData();
    },

    updateDraft: async (id, updates) => {
        const draftRef = doc(db, "drafts", id);
        await setDoc(draftRef, { ...updates }, { merge: true });
        set(state => ({ drafts: state.drafts.map(d => d.id === id ? { ...d, ...updates } : d) }));
        if (updates.status && updates.status === 'Published') {
            const draft = get().drafts.find(d => d.id === id);
            if (draft) { await get().addActivity({ type: 'milestone', source: 'Publisher', title: 'Content Published', desc: `Published "${draft.title}" to ${draft.platform}` }); }
        }
    },

    updateProfile: async (profile) => {
        const user = auth.currentUser;
        if (!user) return;
        const profileRef = doc(db, "profiles", user.uid);
        await setDoc(profileRef, { ...profile, email: user.email, updatedAt: serverTimestamp() }, { merge: true });
        set({ userProfile: { ...get().userProfile, ...profile } as UserProfile });
        await get().addActivity({ type: 'note', source: 'System', title: 'Profile Updated', desc: 'User profile details updated' });
    },

    followUser: async (targetId: string) => {
        const user = auth.currentUser;
        const profile = get().userProfile;
        if (!user || !profile) return;
        const currentFollowing = profile.following || [];
        if (currentFollowing.includes(targetId)) return;
        const newFollowing = [...currentFollowing, targetId];
        set({ userProfile: { ...profile, following: newFollowing } as UserProfile });
        const profileRef = doc(db, "profiles", user.uid);
        await setDoc(profileRef, { following: newFollowing }, { merge: true });
        await get().addActivity({ type: 'milestone', source: 'Community', title: 'Joined Community', desc: `Started following a new builder.` });
    },

    unfollowUser: async (targetId: string) => {
        const user = auth.currentUser;
        const profile = get().userProfile;
        if (!user || !profile) return;
        const currentFollowing = profile.following || [];
        const newFollowing = currentFollowing.filter(id => id !== targetId);
        set({ userProfile: { ...profile, following: newFollowing } as UserProfile });
        const profileRef = doc(db, "profiles", user.uid);
        await setDoc(profileRef, { following: newFollowing }, { merge: true });
    },

    fetchCommunity: async () => {
        set({ isLoading: true });
        try {
            const q = query(collection(db, "profiles")); // Fetch all profiles
            const querySnapshot = await getDocs(q);
            const profiles = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile));
            set({ communityUpdates: profiles, isLoading: false });
        } catch (e) {
            console.error(e);
            set({ isLoading: false });
        }
    },

    fetchTribes: async () => {
        try {
            const snap = await getDocs(collection(db, "tribes"));
            set({ tribes: snap.docs.map(t => ({ ...t.data(), id: t.id } as Tribe)) });
        } catch (e) { console.error("Error fetching tribes", e); }
    },

    createTribe: async (data) => {
        const user = auth.currentUser;
        if (!user) return;

        await addDoc(collection(db, "tribes"), {
            ...data,
            createdBy: user.uid,
            members: [user.uid],
            createdAt: serverTimestamp()
        });

        await get().fetchTribes();
        await get().addActivity({ type: 'milestone', source: 'Tribes', title: 'Tribe Created', desc: `Founded ${data.name}` });
    },

    joinTribe: async (tribeId) => {
        const user = auth.currentUser;
        if (!user) return;
        const tribe = get().tribes.find(t => t.id === tribeId);
        if (!tribe) return;
        if (tribe.members.includes(user.uid)) return;

        const newMembers = [...tribe.members, user.uid];

        await setDoc(doc(db, "tribes", tribeId), { members: newMembers }, { merge: true });

        set(state => ({
            tribes: state.tribes.map(t => t.id === tribeId ? { ...t, members: newMembers } : t)
        }));
        await get().addActivity({ type: 'task', source: 'Tribes', title: 'Joined Tribe', desc: `Joined ${tribe.name}` });
    },

    leaveTribe: async (tribeId) => {
        const user = auth.currentUser;
        if (!user) return;
        const tribe = get().tribes.find(t => t.id === tribeId);
        if (!tribe) return;

        const newMembers = tribe.members.filter(uid => uid !== user.uid);

        await setDoc(doc(db, "tribes", tribeId), { members: newMembers }, { merge: true });

        set(state => ({
            tribes: state.tribes.map(t => t.id === tribeId ? { ...t, members: newMembers } : t)
        }));
    },

    // --- TRIBE POSTS ---
    fetchTribePosts: async (_tribeId: string) => {
        // Mock Implementation
        // In real app: const snap = await getDocs(query(collection(db, "tribePosts"), where("tribeId", "==", tribeId)));
        set({ isLoading: true });
        // Simulate network
        await new Promise(r => setTimeout(r, 300));

        // Return emtpy or filter from local mock if we had any
        set({
            // tribePosts: ... 
            isLoading: false
        });
    },

    createTribePost: async (tribeId: string, content: string) => {
        const user = auth.currentUser;
        const profile = get().userProfile;
        if (!user || !profile) return;

        const newPost: TribePost = {
            id: Date.now().toString(),
            tribeId,
            authorId: user.uid,
            authorName: profile.username,
            content,
            likes: [],
            createdAt: 'Just now'
        };

        // In real app: await addDoc(collection(db, "tribePosts"), newPost);
        set(state => ({
            tribePosts: [newPost, ...state.tribePosts]
        }));
    },

    // --- FRIENDS & MESSAGING ---
    sendFriendRequest: async (toUserId) => {
        const user = auth.currentUser;
        if (!user) return;

        // 1. Check if already connected or pending
        const existing = get().friendRequests.find(r =>
            (r.fromId === user.uid && r.toId === toUserId) ||
            (r.fromId === toUserId && r.toId === user.uid)
        );
        const alreadyFriends = get().userProfile?.friends?.includes(toUserId);

        if (existing || alreadyFriends) {
            useNotificationStore.getState().addNotification({
                type: 'info',
                title: 'Info',
                message: alreadyFriends ? "You are already friends!" : "Request already pending."
            });
            return;
        }

        const newReq: FriendRequest = {
            id: Date.now().toString(),
            fromId: user.uid,
            toId: toUserId,
            status: 'pending'
        };

        // In real app: DB Call
        set(state => ({
            friendRequests: [...state.friendRequests, newReq]
        }));

        useNotificationStore.getState().addNotification({
            type: 'success',
            title: 'Request Sent',
            message: "Friend request sent!"
        });
    },

    acceptFriendRequest: async (requestId) => {
        const user = auth.currentUser;
        const profile = get().userProfile;
        if (!user || !profile) return;

        const req = get().friendRequests.find(r => r.id === requestId);
        if (!req) return;

        // In real app: Update DB, add to both users' friend lists
        set(state => ({
            friendRequests: state.friendRequests.filter(r => r.id !== requestId),
            userProfile: {
                ...state.userProfile!,
                friends: [...(state.userProfile?.friends || []), req.fromId]
            }
        }));

        useNotificationStore.getState().addNotification({
            type: 'success',
            title: 'Connected',
            message: "Friend request accepted!"
        });
    },

    rejectFriendRequest: async (requestId) => {
        set(state => ({
            friendRequests: state.friendRequests.filter(r => r.id !== requestId)
        }));
        useNotificationStore.getState().addNotification({
            type: 'info',
            title: 'Rejected',
            message: "Friend request rejected."
        });
    },

    removeFriend: async (friendId) => {
        const user = auth.currentUser;
        if (!user) return;

        // In real app: DB Call to remove from both
        set(state => ({
            userProfile: {
                ...state.userProfile!,
                friends: state.userProfile?.friends?.filter(id => id !== friendId)
            }
        }));

        useNotificationStore.getState().addNotification({
            type: 'info',
            title: 'Removed',
            message: "Friend removed."
        });
    },

    sendMessage: async (toUserId, content) => {
        const user = auth.currentUser;
        if (!user) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            fromId: user.uid,
            toId: toUserId,
            content,
            createdAt: new Date()
        };

        set(state => ({
            messages: [...state.messages, newMsg]
        }));
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
