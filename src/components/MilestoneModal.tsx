import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { ActionButton } from './ui/ActionButton';
import { useAtumStore } from '../store/useAtumStore';

interface MilestoneModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MilestoneModal = ({ isOpen, onClose }: MilestoneModalProps) => {
    const { addActivity } = useAtumStore();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        setIsSubmitting(true);
        try {
            await addActivity({
                type: 'milestone',
                source: 'Manual',
                title,
                desc
            });
            setTitle('');
            setDesc('');
            onClose();
        } catch (error) {
            console.error("Failed to add milestone:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-surface border border-border rounded-xl p-6 space-y-4 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-textMuted hover:text-textMain transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/10 text-accent">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-textMain">Log Milestone</h3>
                        <p className="text-xs text-textMuted uppercase tracking-wider">Record a significant event</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-textMuted">Milestone Title</label>
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Beta Launch v1.0"
                            className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-accent focus:outline-none transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-textMuted">Description</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="What did you achieve?"
                            className="w-full h-24 bg-background border border-border rounded-lg p-3 text-textMain focus:border-accent focus:outline-none resize-none transition-colors"
                        />
                    </div>

                    <div className="pt-2">
                        <ActionButton
                            primary
                            type="submit"
                            disabled={isSubmitting || !title}
                            className="w-full justify-center py-3 bg-accent hover:bg-accent/90 border-accent/50"
                        >
                            {isSubmitting ? 'Recording...' : 'LOG_MILESTONE'}
                        </ActionButton>
                    </div>
                </form>
            </div>
        </div>
    );
};
