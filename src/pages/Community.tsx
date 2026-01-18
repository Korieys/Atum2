
import { Twitter, Youtube, Linkedin, ThumbsUp, MessageSquare } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { Badge } from '../components/ui/Badge';
import { useAtumStore } from '../store/useAtumStore';
import { useEffect } from 'react';


import { cn } from '../lib/utils';

export const Community = () => {
    const { communityUpdates, fetchCommunity, isLoading, userProfile } = useAtumStore();

    useEffect(() => {
        fetchCommunity();
    }, []);

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 w-1/3 bg-white/5 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white/5 rounded-xl border border-white/5"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative rounded-2xl overflow-hidden h-48 mb-8 border border-border bg-gradient-to-r from-surface to-surfaceHighlight">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(#d2ff28 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
                <div className="absolute bottom-6 left-6 flex items-end gap-4">
                    <div className="w-20 h-20 rounded-xl border-4 border-background shadow-xl flex items-center justify-center bg-primary">
                        <span className="text-3xl font-bold text-black">A</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1 text-textMain">Alex Builder</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-textMuted">
                            <span className="font-medium text-textMain">@alexbuilds</span>
                            <div className="h-4 w-px bg-white/10"></div>
                            <span className="flex items-center gap-1.5 hover:text-[#1DA1F2] transition-colors cursor-pointer"><Twitter size={14} /> 1.2k</span>
                            <span className="flex items-center gap-1.5 hover:text-[#FF0000] transition-colors cursor-pointer"><Youtube size={14} /> 335</span>
                            <span className="flex items-center gap-1.5 hover:text-[#0A66C2] transition-colors cursor-pointer"><Linkedin size={14} /> 850</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-6 right-6">
                    <ActionButton primary>Edit Profile</ActionButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-bold text-lg text-textMain">Community Feed</h3>
                    {communityUpdates.length === 0 ? (
                        <div className="p-8 text-center text-textMuted border border-border bg-surface rounded-xl">
                            No builders found yet. Be the first!
                        </div>
                    ) : (
                        communityUpdates.map((p: any, i) => (
                            <div key={i} className="p-5 rounded-xl border border-border bg-surface">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                            {p.username?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-textMain">{p.username} <span className="text-textMuted font-normal">joined the mission</span></p>
                                            <p className="text-xs text-textMuted">{p.role}</p>
                                        </div>
                                    </div>
                                    <Badge>New</Badge>
                                </div>
                                <p className="text-sm mb-4 leading-relaxed text-textMain">
                                    {p.bio || "Just started building."}
                                </p>
                                {p.techStack && (
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {p.techStack.map((t: string) => (
                                            <span key={t} className="text-xs font-mono bg-black/40 text-textMuted px-2 py-1 rounded">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-4 border-t border-border pt-4">
                                    <button className="flex items-center gap-2 text-xs font-medium hover:brightness-125 transition-colors text-textMuted hover:text-primary">
                                        <ThumbsUp size={14} /> 0
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (userProfile?.following?.includes(p.id)) {
                                                useAtumStore.getState().unfollowUser(p.id);
                                            } else {
                                                useAtumStore.getState().followUser(p.id);
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center gap-2 text-xs font-medium hover:brightness-125 transition-colors",
                                            userProfile?.following?.includes(p.id) ? "text-primary" : "text-textMain hover:text-primary"
                                        )}
                                    >
                                        <MessageSquare size={14} />
                                        {userProfile?.following?.includes(p.id) ? "Joined" : "Join"}
                                    </button>
                                </div>
                            </div>
                        )))}
                </div>

                <div className="space-y-6">
                    <div className="p-5 rounded-xl border border-border bg-surface">
                        <h3 className="font-bold mb-4 text-textMain">Trending Builders</h3>
                        <div className="space-y-4">
                            {communityUpdates.slice(0, 3).map((p: any, i) => (
                                <div key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="w-10 h-10 rounded flex items-center justify-center font-bold text-xs bg-surfaceHighlight text-textMuted group-hover:bg-primary group-hover:text-black transition-colors">#{i + 1}</div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm transition-colors text-textMain group-hover:text-primary">{p.username}</p>
                                        <p className="text-xs text-textMuted">{p.role}</p>
                                    </div>
                                    <div className="text-xs font-bold text-accent">Hot</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
