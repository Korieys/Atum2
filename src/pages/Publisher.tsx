
import { Twitter, Linkedin, Youtube, Plus, MoreHorizontal } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { Badge } from '../components/ui/Badge';


export const Publisher = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-textMain">Content Calendar</h2>
                    <p className="text-textMuted">Schedule and manage your cross-platform content.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center -space-x-2 mr-4 hidden sm:flex">
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-[#1DA1F2] flex items-center justify-center"><Twitter size={14} className="text-white" /></div>
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-[#0A66C2] flex items-center justify-center"><Linkedin size={14} className="text-white" /></div>
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-[#FF0000] flex items-center justify-center"><Youtube size={14} className="text-white" /></div>
                    </div>
                    <ActionButton primary><Plus size={16} /> New Post</ActionButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-7 gap-px border border-border rounded-t-xl overflow-hidden mb-6 bg-border">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <div key={d} className="p-3 text-center text-xs font-bold uppercase tracking-wider bg-surface text-textMuted">{d}</div>
                        ))}
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="min-h-[100px] p-2 relative group transition-colors hover:bg-white/5 bg-surface">
                                <span className="text-xs opacity-30 absolute top-2 right-2 text-textMain">{i + 1}</span>
                                {i === 2 && (
                                    <div className="mt-4 p-2 rounded text-xs font-medium border-l-2 cursor-pointer hover:scale-105 transition-transform bg-primary/10 border-primary text-textMain">
                                        <Twitter size={10} className="mb-1 opacity-70" />
                                        Launch Day
                                    </div>
                                )}
                                {i === 4 && (
                                    <div className="mt-4 p-2 rounded text-xs font-medium border-l-2 cursor-pointer hover:scale-105 transition-transform bg-accent/10 border-accent text-textMain">
                                        <Youtube size={10} className="mb-1 opacity-70" />
                                        Demo
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Queue */}
                <div className="space-y-6">
                    <div className="p-5 rounded-xl border border-border bg-surface">
                        <h3 className="font-bold mb-4 text-textMain">Unscheduled Drafts</h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-3 rounded border border-border bg-surfaceHighlight hover:border-white/20 cursor-grab active:cursor-grabbing transition-colors">
                                    <div className="flex justify-between mb-2">
                                        <Badge variant="default">Idea</Badge>
                                        <MoreHorizontal size={14} className="text-textMuted" />
                                    </div>
                                    <p className="text-sm font-medium truncate text-textMain">Why I chose React over Vue...</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
