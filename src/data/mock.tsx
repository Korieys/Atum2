import { GitCommit, CheckCircle, PenTool, Zap } from 'lucide-react';


// --- Mock Data ---
export const RECENT_ACTIVITY = [
    { id: 1, type: 'commit', source: 'GitHub', title: 'feat: integrated stripe payments', time: '10m ago', icon: <GitCommit size={14} />, details: '7 files changed' },
    { id: 2, type: 'task', source: 'Linear', title: 'Fix overflow on mobile nav', time: '45m ago', icon: <CheckCircle size={14} />, details: 'Ticket #429' },
    { id: 3, type: 'note', source: 'Atum', title: 'Struggling with database schema...', time: '2h ago', icon: <PenTool size={14} />, details: 'View note' },
    { id: 4, type: 'milestone', source: 'System', title: 'Reached 100 active users!', time: '5h ago', icon: <Zap size={14} />, details: 'Milestone unlocked' },
];

export const GENERATED_DRAFTS = [
    { id: 1, type: 'Twitter Thread', title: 'Why I rewrote my auth stack (again)', status: 'Ready', platform: 'twitter' },
    { id: 2, type: 'LinkedIn Post', title: 'The journey to $1k MRR', status: 'Draft', platform: 'linkedin' },
    { id: 3, type: 'YouTube Short', title: 'Coding timelapse: Dark mode', status: 'Scripted', platform: 'youtube' },
];

export const COMMUNITY_UPDATES = [
    { id: 1, user: 'Sarah dev', action: 'forked your roadmap', time: '1h ago' },
    { id: 2, user: 'AlexCode', action: 'commented on your changelog', time: '3h ago' },
];

export const TRACKER_ITEMS = [
    {
        id: 1, date: 'Today', items: [
            { type: 'commit', title: 'refactor: simplify user context', desc: 'Removed redundancy in auth provider', time: '2:30 PM', source: 'GitHub' },
            { type: 'note', title: 'Breakthrough: Cache Invalidation', desc: 'Finally realized why the user profile wasn\'t updating. It was the service worker.', time: '1:15 PM', source: 'Manual' },
            { type: 'task', title: 'Design System Audit', desc: 'Completed review of button variants', time: '11:00 AM', source: 'Linear' }
        ]
    },
    {
        id: 2, date: 'Yesterday', items: [
            { type: 'milestone', title: 'Deployed v1.2.0', desc: 'Major release including dark mode.', time: '4:00 PM', source: 'System' },
            { type: 'commit', title: 'fix: z-index on modal', desc: 'Modal was appearing behind navbar', time: '10:30 AM', source: 'GitHub' }
        ]
    }
];

export const PARKING_LOT_ITEMS = [
    { id: 1, title: 'AI-powered recipe generator', desc: 'Scrape fridge contents and suggest recipes.', tags: ['App', 'AI'], date: '2d ago' },
    { id: 2, title: 'Devlog: Migrating to Next.js', desc: 'Focus on the pain points of hydration errors.', tags: ['Video', 'Content'], date: '5d ago' },
    { id: 3, title: 'Veggie Invaders', desc: 'Space Invaders clone but with healthy food.', tags: ['Game'], date: '1w ago' },
    { id: 4, title: 'Dark Mode Toggle Animation', desc: 'Smooth transition with svg masking.', tags: ['UI/UX', 'Post'], date: '1d ago' },
    { id: 5, title: 'Supabase vs Firebase comparison', desc: 'In-depth analysis for the blog.', tags: ['Article'], date: '3d ago' },
];

export const IDEA_TAGS = ['App', 'Game', 'Video', 'Post', 'Feature', 'Article'];
