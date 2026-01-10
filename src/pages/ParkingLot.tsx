import { useState } from 'react';
import { Lightbulb, Plus, MoreHorizontal, Clock, Trash2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { useAtumStore } from '../store/useAtumStore';

export const ParkingLot = () => {
    const { ideas, addIdea, deleteIdea } = useAtumStore();
    const [newIdea, setNewIdea] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const handleAdd = () => {
        if (!newIdea.trim()) return;
        addIdea({
            title: newIdea,
            desc: 'Just a thought...', // Default for quick entry
            tags: ['New'],
        });
        setNewIdea('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-1 text-textMain">Idea Parking Lot</h2>
                    <p className="text-textMuted">Capture now, build later.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Quick capture..."
                            className="bg-surface border border-border rounded-lg pl-4 pr-10 py-2 w-64 text-sm focus:outline-none focus:border-primary text-textMain placeholder:text-textMuted"
                            value={newIdea}
                            onChange={(e) => setNewIdea(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            onClick={handleAdd}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
                {['All', 'Feature', 'Content', 'Bug', 'Moonshot'].map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === 'All' ? null : tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${(tag === 'All' && !selectedTag) || selectedTag === tag
                            ? 'bg-primary text-black border-transparent'
                            : 'bg-transparent border-border text-textMuted hover:border-primary/50'
                            }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {ideas.map((idea) => (
                    <div key={idea.id} className="break-inside-avoid p-5 rounded-xl border border-border bg-surface hover:border-primary/30 transition-all group relative">
                        <button
                            onClick={() => deleteIdea(idea.id)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-textMuted hover:text-accent transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="flex gap-2 mb-3">
                            {idea.tags.map(tag => (
                                <Badge key={tag} variant="default">{tag}</Badge>
                            ))}
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-textMain">{idea.title}</h3>
                        <p className="text-sm leading-relaxed mb-4 text-textMuted">{idea.desc}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-border opacity-50">
                            <div className="flex items-center gap-1 text-xs text-textMuted">
                                <Clock size={12} /> {idea.date}
                            </div>
                            <button className="hover:bg-white/10 p-1 rounded text-textMain"><MoreHorizontal size={14} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State if no ideas */}
            {ideas.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Lightbulb size={48} className="mx-auto mb-4 text-textMuted" />
                    <p className="text-textMuted">No ideas yet. Start typing above!</p>
                </div>
            )}
        </div>
    );
};
