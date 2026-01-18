import { useState } from 'react';
import { Lightbulb, Plus, Clock, Trash2, Tag, Zap } from 'lucide-react';
import { useAtumStore } from '../store/useAtumStore';
import { IdeaModal } from '../components/IdeaModal';
import { cn } from '../lib/utils';

export const ParkingLot = () => {
    const { ideas, deleteIdea } = useAtumStore();
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredIdeas = selectedTag
        ? ideas.filter(i => i.tags.includes(selectedTag))
        : ideas;

    // Premium Color Generation based on tags - Vibrant Neon Palette
    // Used for Badges
    const getBadgeStyle = (tag: string) => {
        switch (tag) {
            case 'Feature': return 'from-blue-500 to-cyan-400 text-cyan-100 bg-blue-500/20 border-blue-400/30';
            case 'Bug': return 'from-red-500 to-pink-500 text-pink-100 bg-red-500/20 border-red-400/30';
            case 'Moonshot': return 'from-purple-500 to-indigo-500 text-purple-100 bg-purple-500/20 border-purple-400/30';
            case 'Content': return 'from-amber-400 to-orange-500 text-amber-100 bg-orange-500/20 border-orange-400/30';
            case 'Marketing': return 'from-emerald-400 to-green-500 text-emerald-100 bg-emerald-500/20 border-emerald-400/30';
            default: return 'from-gray-500 to-slate-400 text-gray-100 bg-gray-500/20 border-gray-400/30';
        }
    };

    // Precision Edge Hover Styles
    // Sharp border transition + Text color shift
    const getHoverClasses = (tag: string) => {
        switch (tag) {
            case 'Feature': return {
                container: 'hover:border-blue-500 hover:bg-surface/80',
                text: 'group-hover:text-blue-400'
            };
            case 'Bug': return {
                container: 'hover:border-red-500 hover:bg-surface/80',
                text: 'group-hover:text-red-400'
            };
            case 'Moonshot': return {
                container: 'hover:border-purple-500 hover:bg-surface/80',
                text: 'group-hover:text-purple-400'
            };
            case 'Content': return {
                container: 'hover:border-amber-500 hover:bg-surface/80',
                text: 'group-hover:text-amber-400'
            };
            case 'Marketing': return {
                container: 'hover:border-emerald-500 hover:bg-surface/80',
                text: 'group-hover:text-emerald-400'
            };
            default: return {
                container: 'hover:border-gray-500',
                text: 'group-hover:text-gray-400'
            };
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen relative overflow-hidden">
            <IdeaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Ambient Background Mesh - Toned down slightly */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-10 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] opacity-10" />
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary animate-pulse">
                            <Zap size={20} className="fill-primary/20" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Idea Lab
                        </h2>
                    </div>
                    <p className="text-textMuted max-w-lg text-base font-light leading-relaxed">
                        Where raw thoughts become <span className="text-primary font-medium">reality</span>.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group relative flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="text-sm tracking-wide">NEW IDEA</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="mb-8 flex gap-3 overflow-x-auto pb-4 pt-2 pl-1 scrollbar-hide relative z-10">
                {['All', 'Feature', 'Content', 'Bug', 'Moonshot', 'Marketing'].map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === 'All' ? null : tag)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 border backdrop-blur-md whitespace-nowrap",
                            (tag === 'All' && !selectedTag) || selectedTag === tag
                                ? "bg-white/10 border-white/30 text-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.2)] scale-105"
                                : "bg-surface/30 border-white/5 text-textMuted hover:bg-white/5 hover:border-white/20 hover:text-white"
                        )}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {/* Grid Layout - Compact */}
            {filteredIdeas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-3xl bg-surface/10 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="bg-surface p-4 rounded-full mb-4 ring-1 ring-white/10 shadow-lg relative z-10">
                        <Lightbulb size={32} className="text-textMuted group-hover:text-primary transition-colors duration-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 text-center relative z-10">Your canvas is empty</h3>
                    <p className="text-textMuted text-sm mb-6 text-center max-w-sm relative z-10">Great products start with a single spark.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-primary hover:text-primary/80 font-bold text-xs flex items-center gap-2 hover:underline underline-offset-4 relative z-10"
                    >
                        START CAPTURING <Plus size={14} />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10 pb-20">
                    {filteredIdeas.map((idea) => {
                        const tag = idea.tags[0] || 'Feature';
                        const badgeStyle = getBadgeStyle(tag);
                        const hoverInfo = getHoverClasses(tag);

                        return (
                            <div
                                key={idea.id}
                                className={cn(
                                    "group relative break-inside-avoid p-[1px] rounded-2xl bg-gradient-to-b from-white/5 to-transparent transition-all duration-300 hover:-translate-y-1",
                                    hoverInfo.container
                                )}
                            >
                                <div className="h-full w-full bg-[#0a0f0a] rounded-[0.9rem] p-5 relative overflow-hidden flex flex-col min-h-[160px]">

                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <div className={cn("px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border shadow-sm backdrop-blur-md", badgeStyle)}>
                                            {tag}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Delete this idea?')) deleteIdea(idea.id);
                                            }}
                                            className="text-textMuted/40 hover:text-red-400 p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500/10 rounded-lg"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <h3
                                        className={cn(
                                            "font-bold text-lg mb-2 text-white transition-colors duration-300 leading-tight",
                                            hoverInfo.text
                                        )}
                                    >
                                        {idea.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-textMuted mb-4 flex-grow line-clamp-3 font-light group-hover:text-textMuted/90 transition-colors">
                                        {idea.desc}
                                    </p>

                                    <div className="pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-textMuted/50 group-hover:text-textMuted transition-colors relative z-10">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={10} />
                                            <span className="font-mono tracking-wide">{idea.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 duration-300 delay-75">
                                            <Tag size={10} />
                                            <span className="font-medium">{idea.tags.length > 1 ? `+${idea.tags.length - 1}` : '#tagged'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
