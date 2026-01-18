import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { Badge } from '../components/ui/Badge';
import { useAtumStore } from '../store/useAtumStore';
import type { DraftItem } from '../store/useAtumStore';
import { useAuth } from '../components/auth/AuthProvider';
import { InputModal } from '../components/ui/InputModal';

export const Publisher = () => {
    const { drafts, updateDraft, addDraft, isLoading } = useAtumStore();
    const { user } = useAuth(); // kept for check in handleCreateDraft
    const [isInputModalOpen, setIsInputModalOpen] = useState(false);

    const handleStatusChange = async (id: string, newStatus: DraftItem['status']) => {
        await updateDraft(id, { status: newStatus });
    };

    const handleCreateDraft = async (title: string) => {
        // Ensure user is logged in before adding draft
        if (!user) return;

        await addDraft({
            title,
            type: 'text',
            platform: 'twitter',
            status: 'Draft',
            content: ''
        });
    };

    const draftsList = drafts.filter(d => d.status === 'Draft');
    const scheduledList = drafts.filter(d => d.status === 'Ready');
    const publishedList = drafts.filter(d => d.status === 'Published');

    if (isLoading) {
        return <div className="p-8 text-center text-textMuted animate-pulse">Loading publisher...</div>;
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InputModal
                isOpen={isInputModalOpen}
                onClose={() => setIsInputModalOpen(false)}
                onSubmit={handleCreateDraft}
                title="New Content Draft"
                label="Draft Title"
                placeholder="Give your post a working title..."
                confirmText="Create Draft"
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-textMain">Content Calendar</h2>
                    <p className="text-textMuted">Schedule and manage your cross-platform content.</p>
                </div>
                <div className="flex gap-2">
                    <ActionButton primary onClick={() => setIsInputModalOpen(true)}><Plus size={16} /> New Post</ActionButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Unscheduled Drafts */}
                <div className="p-5 rounded-xl border border-border bg-surface h-fit">
                    <h3 className="font-bold mb-4 text-textMain flex items-center gap-2">
                        Drafts <Badge variant="secondary">{draftsList.length}</Badge>
                    </h3>
                    <div className="space-y-3">
                        {draftsList.map((d) => (
                            <div key={d.id} className="p-3 rounded border border-border bg-surfaceHighlight hover:border-white/20 transition-all group">
                                <div className="flex justify-between mb-2">
                                    <Badge variant="outline">{d.platform}</Badge>
                                </div>
                                <p className="text-sm font-medium truncate text-textMain mb-2">{d.title}</p>
                                <button
                                    onClick={() => handleStatusChange(d.id, 'Ready')}
                                    className="text-xs bg-primary/10 text-primary w-full py-2 rounded hover:bg-primary hover:text-black transition-colors"
                                >
                                    Schedule
                                </button>
                            </div>
                        ))}
                        {draftsList.length === 0 && <p className="text-xs text-textMuted italic">No drafts yet.</p>}
                    </div>
                </div>

                {/* 2. Scheduled / Ready */}
                <div className="p-5 rounded-xl border border-border bg-surface h-fit">
                    <h3 className="font-bold mb-4 text-textMain flex items-center gap-2">
                        Scheduled <Badge variant="secondary">{scheduledList.length}</Badge>
                    </h3>
                    <div className="space-y-3">
                        {scheduledList.map((d) => (
                            <div key={d.id} className="p-3 rounded border border-l-4 border-l-primary border-t border-r border-b border-border bg-surfaceHighlight hover:border-white/20 transition-all">
                                <div className="flex justify-between mb-2">
                                    <Badge variant="outline">{d.platform}</Badge>
                                    <span className="text-xs text-textMuted">Ready</span>
                                </div>
                                <p className="text-sm font-medium truncate text-textMain mb-2">{d.title}</p>
                                <button
                                    onClick={() => handleStatusChange(d.id, 'Published')}
                                    className="text-xs bg-green-500/10 text-green-500 w-full py-2 rounded hover:bg-green-500 hover:text-black transition-colors"
                                >
                                    Publish Now
                                </button>
                            </div>
                        ))}
                        {scheduledList.length === 0 && <p className="text-xs text-textMuted italic">Nothing scheduled.</p>}
                    </div>
                </div>

                {/* 3. Published History */}
                <div className="p-5 rounded-xl border border-border bg-surface h-fit opacity-70 hover:opacity-100 transition-opacity">
                    <h3 className="font-bold mb-4 text-textMain flex items-center gap-2">
                        Published <Badge variant="secondary">{publishedList.length}</Badge>
                    </h3>
                    <div className="space-y-3">
                        {publishedList.map((d) => (
                            <div key={d.id} className="p-3 rounded border border-border bg-black/20">
                                <p className="text-xs text-textMuted line-through">{d.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
