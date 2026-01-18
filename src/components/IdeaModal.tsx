import { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { ActionButton } from './ui/ActionButton';
import { useAtumStore } from '../store/useAtumStore';
import { cn } from '../lib/utils';
import { Modal } from './ui/Modal';

interface IdeaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const IDEA_TAGS = ['Feature', 'Content', 'Bug', 'Moonshot', 'Marketing'];

export const IdeaModal = ({ isOpen, onClose }: IdeaModalProps) => {
    const { addIdea } = useAtumStore();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('Feature');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        setIsSubmitting(true);
        try {
            await addIdea({
                title,
                desc,
                tags: [selectedTag]
            });
            setTitle('');
            setDesc('');
            setSelectedTag('Feature');
            onClose();
        } catch (error) {
            console.error("Failed to add idea:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={false}
            className="max-w-lg bg-[#0a0f0a] border-white/10 rounded-3xl p-0 overflow-hidden group shadow-2xl"
        >
            <div className="p-8 relative">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 p-[1px] rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent pointer-events-none" />
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-textMuted hover:text-white transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <Lightbulb size={28} />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-white tracking-tight">Spark a New Idea</h3>
                        <p className="text-sm text-textMuted">Capture it before it fades away.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-textMuted/80">Concept Title</label>
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="E.g., AI-Powered Search"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg text-white placeholder:text-white/20 focus:border-primary/50 focus:bg-white/10 focus:outline-none transition-all placeholder:font-light"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-textMuted/80">Tag</label>
                        <div className="flex flex-wrap gap-2">
                            {IDEA_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setSelectedTag(tag)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                                        selectedTag === tag
                                            ? "bg-primary text-black border-primary shadow-[0_0_15px_-3px_rgba(var(--primary),0.4)]"
                                            : "bg-white/5 border-white/5 text-textMuted hover:bg-white/10 hover:border-white/10"
                                    )}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-textMuted/80">Details (Optional)</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Elaborate on your idea..."
                            className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-textMain placeholder:text-white/20 focus:border-primary/50 focus:outline-none resize-none transition-all focus:bg-black/40"
                        />
                    </div>

                    <div className="pt-4">
                        <ActionButton
                            primary
                            type="submit"
                            disabled={isSubmitting || !title}
                            className="w-full justify-center py-4 text-base font-semibold bg-primary hover:bg-primary/90 text-black border-none shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] hover:shadow-[0_0_25px_-5px_rgba(var(--primary),0.6)] transition-all"
                        >
                            {isSubmitting ? 'Capturing...' : 'Capture Idea'}
                        </ActionButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
