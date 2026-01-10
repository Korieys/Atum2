import { create } from 'zustand';
import { supabase } from '../lib/supabase';
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
    date: string; // Display string, derived from created_at
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
    communityUpdates: COMMUNITY_UPDATES, // Static for now
    isLoading: false,

    fetchData: async () => {
        set({ isLoading: true });

        // 1. Fetch Activity
        const { data: activity } = await supabase
            .from('activity_log')
            .select('*')
            .order('created_at', { ascending: false });

        // 2. Fetch Ideas
        const { data: ideas } = await supabase
            .from('ideas')
            .select('*')
            .order('created_at', { ascending: false });

        // 3. Fetch Drafts
        const { data: drafts } = await supabase
            .from('drafts')
            .select('*')
            .order('created_at', { ascending: false });

        set({
            isLoading: false,
            activityLog: (activity || []).map(a => ({
                ...a,
                time: new Date(a.created_at).toLocaleDateString(), // Simple formatting
                desc: a.description
            })),
            ideas: (ideas || []).map(i => ({
                ...i,
                desc: i.description,
                date: new Date(i.created_at).toLocaleDateString()
            })),
            drafts: (drafts || []).map(d => ({
                ...d,
                // map db columns if needed
            }))
        });
    },

    addActivity: async (item) => {
        const { error } = await supabase.from('activity_log').insert({
            title: item.title,
            type: item.type,
            source: item.source,
            description: item.desc
        });

        if (!error) {
            await get().fetchData();
        }
    },

    addIdea: async (item) => {
        const { error } = await supabase.from('ideas').insert({
            title: item.title,
            description: item.desc,
            tags: item.tags
        });

        if (!error) {
            await get().fetchData();
        }
    },

    deleteIdea: async (id) => {
        const { error } = await supabase.from('ideas').delete().eq('id', id);
        if (!error) {
            set(state => ({
                ideas: state.ideas.filter(i => i.id !== id)
            }));
        }
    },

    addDraft: async (draft) => {
        const { error } = await supabase.from('drafts').insert({
            title: draft.title,
            type: draft.type,
            platform: draft.platform,
            status: draft.status,
            content: draft.content
        });

        if (!error) {
            await get().fetchData();
        }
    },
}));
