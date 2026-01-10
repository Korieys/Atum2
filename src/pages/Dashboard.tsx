
import {
    Radio,
    PenTool,
    Zap,
    Terminal,
    Cpu
} from 'lucide-react';
import { TechCard } from '../components/ui/TechCard';
import { ActionButton } from '../components/ui/ActionButton';
import { useAtumStore, type ActivityItem } from '../store/useAtumStore';
import { cn } from '../lib/utils';
import { GitCommit, CheckCircle } from 'lucide-react';

const TerminalFeedItem = ({ item, index }: { item: ActivityItem, index: number }) => {
    // Mapping icons based on type string since we can't persist React components in JSON
    const getIcon = (type: string) => {
        switch (type) {
            case 'commit': return <GitCommit size={14} />;
            case 'task': return <CheckCircle size={14} />;
            case 'note': return <PenTool size={14} />;
            case 'milestone': return <Zap size={14} />;
            default: return <Terminal size={14} />;
        }
    };

    return (
        <div className="flex gap-4 group">
            {/* Line & Dot */}
            <div className="flex flex-col items-center">
                <div className="w-px h-full bg-white/10 group-last:bg-transparent relative">
                    <div className={cn(
                        "absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-black",
                        index === 0 ? "bg-primary" : "bg-textMuted"
                    )} />
                </div>
            </div>

            {/* Content */}
            <div className="pb-8 flex-1">
                <div className="p-4 rounded-lg border border-border transition-all hover:translate-x-1 bg-surfaceHighlight/30">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className={cn("font-mono text-[10px] opacity-70", index === 0 ? "text-primary" : "text-primary")}>
                                {item.time} {/* Simplified for MVP */}
                            </span>
                            <span className="h-3 w-px bg-border" />
                            <span className="text-xs font-bold uppercase tracking-wider text-textMain">{item.source}</span>
                        </div>
                        <div className="p-1 rounded-md border border-border bg-background text-textMuted">
                            {getIcon(item.type)}
                        </div>
                    </div>

                    <h4 className="font-mono text-sm mb-1 truncate text-textMain">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-textMuted">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span className="font-mono opacity-50">{item.desc || item.details}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Dashboard = () => {
    const { activityLog, drafts, communityUpdates } = useAtumStore();

    // Computed Stats
    const velocity = activityLog.filter(i => i.type === 'commit').length * 4; // Mock calculation
    const streak = 14; // We'd need actual dates for this, keeping static for MVP

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Section: Mission Control Header */}
            <div className="relative p-6 rounded-2xl border border-border overflow-hidden bg-gradient-to-r from-surface to-surfaceHighlight">
                <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none bg-gradient-to-l from-primary/5 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <Radio size={16} className="animate-pulse" />
                            <span className="text-xs font-mono font-bold tracking-widest uppercase">System Online</span>
                        </div>
                        <h1 className="text-3xl font-bold text-textMain">Mission Control</h1>
                        <p className="text-textMuted">Build Cycle #429 • <span className="text-textMain">Phase 3: Scaling</span></p>
                    </div>

                    <div className="flex gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-xs font-mono uppercase text-textMuted">Uptime</div>
                            <div className="text-xl font-mono font-bold text-textMain">14d 03h 12m</div>
                        </div>
                        <div className="h-10 w-px hidden md:block bg-border" />
                        <div className="flex gap-2">
                            <ActionButton className="h-10 px-4"><PenTool size={16} /></ActionButton>
                            <ActionButton primary className="h-10 px-6 font-mono tracking-wide"><Zap size={16} /> GENERATE_LOG</ActionButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section: Data Banks (Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <TechCard title="Velocity" value={velocity.toString()} subtext="commits/wk estim." trend="+12%" />
                <TechCard title="Reach" value="12.5k" subtext="impressions" trend="+8%" />
                <TechCard title="Colony" value="340" subtext="members" trend="+3" />
                <TechCard title="Streak" value={streak.toString()} subtext="days active" trend="HOT" />
            </div>

            {/* Section: Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Col: Live Terminal (Activity) */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="p-1 rounded-xl border border-border bg-surface">
                        <div className="px-4 py-3 border-b border-border flex justify-between items-center rounded-t-lg bg-surfaceHighlight/20">
                            <h3 className="font-mono text-sm font-bold flex items-center gap-2 text-textMain">
                                <Terminal size={14} className="text-primary" />
                                LIVE_ACTIVITY_LOG
                            </h3>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full animate-pulse bg-accent" />
                                <span className="text-[10px] font-mono uppercase text-textMuted">Syncing</span>
                            </div>
                        </div>
                        <div className="p-6">
                            {activityLog.slice(0, 5).map((item, idx) => (
                                <TerminalFeedItem key={item.id} item={item} index={idx} />
                            ))}
                            <button className="w-full py-2 mt-[-10px] text-xs font-mono border border-dashed border-border rounded transition-colors hover:bg-white/5 text-primary">
                                LOAD_MORE_LOGS()
                            </button>
                        </div>
                    </div>
                </div>

                {/* Col: Side Modules */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Module: Content Fabricator */}
                    <div className="rounded-xl border border-border overflow-hidden bg-surface">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-mono text-sm font-bold flex items-center gap-2 text-textMain">
                                <Cpu size={14} className="text-primary" />
                                FABRICATOR
                            </h3>
                            <span className="text-[10px] font-mono text-textMuted">Q: {drafts.length}</span>
                        </div>

                        <div className="p-2 space-y-1 bg-surfaceHighlight/10">
                            {drafts.slice(0, 3).map((draft, i) => (
                                <div key={draft.id} className="p-3 rounded border border-transparent hover:bg-white/5 group cursor-pointer transition-all">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-accent">{draft.platform}</span>
                                        {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </div>
                                    <h4 className="text-xs font-medium leading-snug mb-2 transition-colors text-textMain">{draft.title}</h4>
                                    <div className="w-full h-1 rounded-full overflow-hidden bg-border">
                                        <div className="h-full bg-primary" style={{ width: draft.status === 'Ready' ? '100%' : '60%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-border">
                            <ActionButton primary className="w-full py-2 text-xs font-mono uppercase">
                                <Zap size={14} /> Initialize New Draft
                            </ActionButton>
                        </div>
                    </div>

                    {/* Module: Signal Radar */}
                    <div className="rounded-xl border border-border overflow-hidden bg-surface">
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-mono text-sm font-bold flex items-center gap-2 text-textMain">
                                <Radio size={14} className="text-primary" />
                                INCOMING_SIGNALS
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {communityUpdates.map(update => (
                                <div key={update.id} className="flex gap-3 items-center">
                                    <div className="w-8 h-8 rounded border border-border flex items-center justify-center text-xs font-bold bg-surfaceHighlight text-primary">
                                        {update.user.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs truncate text-textMain">
                                            <span className="font-bold">{update.user}</span> {update.action}
                                        </p>
                                        <span className="text-[10px] font-mono text-textMuted">{update.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
