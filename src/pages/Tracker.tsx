import { useState } from 'react';
import { Filter, Plus, GitCommit, X, Trash2 } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { Badge } from '../components/ui/Badge';
import { useAtumStore, type ActivityItem } from '../store/useAtumStore';
import { cn } from '../lib/utils';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { useNotificationStore } from '../store/useNotificationStore';
import { DailyInsight } from '../components/DailyInsight';

export const Tracker = () => {
    const { activityLog, addActivity, deleteActivity } = useAtumStore();
    const { addNotification } = useNotificationStore();
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [type, setType] = useState<ActivityItem['type']>('note');
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // Filter State
    const [filterType, setFilterType] = useState<ActivityItem['type'] | 'all'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredLog = filterType === 'all'
        ? activityLog
        : activityLog.filter(item => item.type === filterType);

    const handleSave = () => {
        if (!title) return;
        addActivity({
            type,
            title,
            desc,
            source: 'Manual',
        });
        setTitle('');
        setDesc('');
        setShowEntryForm(false);
        addNotification({
            type: 'success',
            title: 'Entry Saved',
            message: `Your ${type} has been recorded.`
        });
    };

    const handleConfirmDelete = () => {
        if (itemToDelete) {
            deleteActivity(itemToDelete);
            addNotification({
                type: 'success',
                title: 'Activity Deleted',
                message: 'The activity has been permanently removed.'
            });
            setItemToDelete(null);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Activity?"
                message="This action cannot be undone. Are you sure you want to proceed?"
            />

            {/* Modal / Inline Form Overlay */}
            {showEntryForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg text-textMain">New Entry</h3>
                            <button onClick={() => setShowEntryForm(false)} className="text-textMuted hover:text-textMain"><X size={20} /></button>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-textMuted block mb-2">Type</label>
                            <div className="flex gap-2">
                                {(['note', 'milestone', 'task'] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={cn(
                                            "px-3 py-1 rounded border text-xs capitalize",
                                            type === t ? "border-primary bg-primary/10 text-primary" : "border-border text-textMuted"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-textMuted block mb-2">Title</label>
                            <input
                                className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none"
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What did you do?"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-textMuted block mb-2">Details</label>
                            <textarea
                                className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none h-24"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Add some context..."
                            />
                        </div>
                        <ActionButton onClick={handleSave} primary className="w-full justify-center">Save Entry</ActionButton>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-1 text-textMain">Smart Progress Tracker</h2>
                    <p className="text-textMuted">Your automated project diary.</p>
                </div>
                <div className="flex gap-2 relative">
                    <div className="relative">
                        <ActionButton onClick={() => setIsFilterOpen(!isFilterOpen)} className={cn(isFilterOpen && "bg-white/10 text-white")}>
                            <Filter size={16} />
                            {filterType === 'all' ? 'Filter' : `Filter: ${filterType}`}
                        </ActionButton>

                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-1">
                                    {(['all', 'note', 'milestone', 'task', 'commit'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => {
                                                setFilterType(t as any);
                                                setIsFilterOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-3 py-2 text-sm rounded-lg capitalize transition-colors flex items-center justify-between group",
                                                filterType === t ? "bg-primary/10 text-primary" : "text-textMuted hover:bg-white/5 hover:text-textMain"
                                            )}
                                        >
                                            {t}
                                            {filterType === t && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Backdrop to close */}
                        {isFilterOpen && <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />}
                    </div>

                    <ActionButton onClick={() => setShowEntryForm(true)} primary><Plus size={16} /> Manual Entry</ActionButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="font-bold text-lg text-textMain">Recent Activity</span>
                            <div className="h-px flex-1 bg-border"></div>
                        </div>

                        {filteredLog.length === 0 ? (
                            <div className="p-8 text-center rounded-xl border border-dashed border-border bg-surface/50">
                                <p className="text-textMuted mb-2">No activity recorded yet.</p>
                                <p className="text-xs text-textMuted/70">
                                    {filterType === 'all' ? "Actions you take in the app will appear here automatically." : `No items found for filter: ${filterType}`}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4 relative pl-4 border-l-2 border-surfaceHighlight">
                                {filteredLog.map((item) => (
                                    <div key={item.id} className="relative group">
                                        {/* Timeline Dot */}
                                        <div
                                            className={cn(
                                                "absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 transition-colors bg-background",
                                                item.type === 'milestone' ? "border-accent" : "border-primary"
                                            )}
                                        />

                                        <div className="p-4 rounded-xl border border-border transition-all hover:translate-x-1 bg-surface relative">
                                            {item.source !== 'GitHub' && (
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setItemToDelete(item.id);
                                                        }}
                                                        className="p-1 hover:bg-background rounded text-textMuted hover:text-red-500"
                                                        title="Delete activity"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-start mb-2 pr-6">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={item.type === 'milestone' ? 'accent' : 'primary'}>{item.type}</Badge>
                                                    <span className="text-xs text-textMuted">{item.source}</span>
                                                </div>
                                                <span className="text-xs text-textMuted">{item.time}</span>
                                            </div>
                                            <h3 className="font-bold text-lg mb-1 text-textMain">{item.title}</h3>
                                            <p className="text-sm opacity-80 text-textMuted">{item.desc || item.details}</p>

                                            {item.type === 'commit' && (
                                                <div className="mt-3 p-2 rounded font-mono text-xs flex items-center gap-2 bg-black/30 text-textMuted">
                                                    <GitCommit size={12} /> 7 files changed
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Daily Insight Module */}
                    <DailyInsight />
                </div>
            </div>
        </div>
    );
};
