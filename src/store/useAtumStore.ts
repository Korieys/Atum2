import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { COMMUNITY_UPDATES } from '../data/mock';

// --- Types ---
export interface ActivityItem {
    id: string;
    type: 'commit' | 'task' | 'note' | 'milestone';
    source: string;
    title: string;
    desc?: string;
    time: string;
    details?: string;
}

export interface IdeaItem {
    id: string;
    title: string;
    desc: string;
    tags: string[];
    date: string;
}

export interface DraftItem {
    id: string;
    type: string;
    title: string;
    status: 'Ready' | 'Draft' | 'Scripted';
    platform: string;
    content?: string;
}

interface AtumState {
    activityLog: ActivityItem[];
    ideas: IdeaItem[];
    drafts: DraftItem[];
    communityUpdates: any[];
    isLoading: boolean;

    fetchData: () => Promise<void>;

    addActivity: (item: Omit<ActivityItem, 'id' | 'time'>) => Promise<void>;
    addIdea: (item: Omit<IdeaItem, 'id' | 'date'>) => Promise<void>;
    deleteIdea: (id: string) => Promise<void>;
    addDraft: (draft: Omit<DraftItem, 'id'>) => Promise<void>;
}

export const useAtumStore = create<AtumState>((set, get) => ({
    activityLog: [],
    ideas: [],
    drafts: [],
    communityUpdates: COMMUNITY_UPDATES,
    isLoading: false,

    fetchData: async () => {
        const user = auth.currentUser;
        if (!user) return; // Can't fetch if not logged in

        set({ isLoading: true });

        try {
            // 1. Fetch Activity
            // Note: Composite indexes might be required for where() + orderBy()
            // Simplify for now: standard fetch, sort client side if index missing errors occur
            const activityQ = query(collection(db, "activity"), where("userId", "==", user.uid));
            const activitySnap = await getDocs(activityQ);
            const activity = activitySnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

            // 2. Fetch Ideas
            const ideasQ = query(collection(db, "ideas"), where("userId", "==", user.uid));
            const ideasSnap = await getDocs(ideasQ);
            const ideas = ideasSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

            // 3. Fetch Drafts
            const draftsQ = query(collection(db, "drafts"), where("userId", "==", user.uid));
            const draftsSnap = await getDocs(draftsQ);
            const drafts = draftsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

            set({
                isLoading: false,
                activityLog: activity.map(a => ({
                    ...a,
                    time: a.createdAt?.toDate().toLocaleDateString() || 'Just now',
                    desc: a.description
                })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), // fallback sort

                ideas: ideas.map(i => ({
                    ...i,
                    desc: i.description,
                    date: i.createdAt?.toDate().toLocaleDateString() || 'Just now'
                })),

                drafts: drafts
            });
        } catch (e) {
            console.error("Error fetching data", e);
            set({ isLoading: false });
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

        await get().fetchData();
    },
}));
