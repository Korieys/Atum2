import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Send, Heart, UserPlus, MessageSquare } from 'lucide-react';
import { useAtumStore } from '../store/useAtumStore';
import { ActionButton } from '../components/ui/ActionButton';
import { cn } from '../lib/utils';
import { useAuth } from '../components/auth/AuthProvider';

export const TribeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        tribes,
        joinTribe,
        leaveTribe,
        userProfile,
        tribePosts,
        createTribePost,
        fetchTribePosts
    } = useAtumStore();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<'feed' | 'members'>('feed');
    const [newPostContent, setNewPostContent] = useState('');

    const tribe = tribes.find(t => t.id === id);
    const isMember = tribe?.members.includes(user?.uid || '');

    useEffect(() => {
        if (id) {
            fetchTribePosts(id);
        }
    }, [id, fetchTribePosts]);

    if (!tribe) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-red-500">Tribe not found</h2>
                <ActionButton onClick={() => navigate('/app/tribes')} className="mt-4">Go Back</ActionButton>
            </div>
        );
    }

    const handleJoinLeave = async () => {
        if (isMember) {
            if (window.confirm("Leave this tribe?")) {
                await leaveTribe(tribe.id);
            }
        } else {
            await joinTribe(tribe.id);
        }
    };

    const handlePost = async () => {
        if (!newPostContent.trim()) return;
        await createTribePost(tribe.id, newPostContent);
        setNewPostContent('');
    };

    // Filter posts for this tribe (if store holds all posts)
    const posts = tribePosts.filter(p => p.tribeId === tribe.id);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header / Banner */}
            <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6 group">
                <button
                    onClick={() => navigate('/app/tribes')}
                    className="absolute top-4 left-4 z-20 bg-black/50 hover:bg-black/70 p-2 rounded-full text-white backdrop-blur-md transition-all hover:pr-4 flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm">Back to Tribes</span>
                </button>

                <div
                    className={cn("absolute inset-0 bg-cover bg-center", !tribe.banner?.startsWith('/') && tribe.banner)}
                    style={tribe.banner?.startsWith('/') ? { backgroundImage: `url(${tribe.banner})` } : {}}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent"></div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-md">{tribe.name}</h1>
                        <p className="text-white/80 max-w-2xl text-sm md:text-base drop-shadow-sm">{tribe.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-white/80 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                            <Users size={16} />
                            <span className="text-sm font-bold">{tribe.members.length} Members</span>
                        </div>
                        <ActionButton
                            primary={!isMember}
                            onClick={handleJoinLeave}
                            className={cn(isMember ? "bg-white/10 text-white hover:bg-white/20 border-white/20" : "")}
                        >
                            {isMember ? "Leave Tribe" : "Join Tribe"}
                        </ActionButton>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-6 border-b border-border mb-6">
                <button
                    onClick={() => setActiveTab('feed')}
                    className={cn(
                        "pb-3 text-sm font-bold border-b-2 transition-colors px-2",
                        activeTab === 'feed' ? "border-primary text-primary" : "border-transparent text-textMuted hover:text-textMain"
                    )}
                >
                    Tribe Feed
                </button>
                <button
                    onClick={() => setActiveTab('members')}
                    className={cn(
                        "pb-3 text-sm font-bold border-b-2 transition-colors px-2",
                        activeTab === 'members' ? "border-primary text-primary" : "border-transparent text-textMuted hover:text-textMain"
                    )}
                >
                    Members
                </button>
            </div>

            {/* FEED TAB */}
            {activeTab === 'feed' && (
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Create Post */}
                    {isMember ? (
                        <div className="bg-surface border border-border rounded-xl p-4 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                                {userProfile?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder={`Share something with the ${tribe.name} tribe...`}
                                    className="w-full bg-transparent border-none focus:outline-none resize-none min-h-[80px] text-textMain placeholder:text-textMuted"
                                />
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/50">
                                    <div className="text-xs text-textMuted">Markdown supported</div>
                                    <ActionButton primary onClick={handlePost} disabled={!newPostContent.trim()} className="py-1.5 px-4 text-xs">
                                        Post <Send size={12} className="ml-2" />
                                    </ActionButton>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center text-primary text-sm">
                            Join this tribe to verify posts and interact!
                        </div>
                    )}

                    {/* Post List */}
                    <div className="space-y-4">
                        {posts.length === 0 ? (
                            <div className="text-center py-12 text-textMuted">
                                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                <p>No posts yet. Be the first!</p>
                            </div>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} className="bg-surface border border-border rounded-xl p-5 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-8 h-8 rounded-full bg-surfaceHighlight flex items-center justify-center font-bold text-xs text-textMain">
                                                {post.authorName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-textMain hover:underline cursor-pointer">{post.authorName}</div>
                                                <div className="text-[10px] text-textMuted">{post.createdAt}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-textMain text-sm leading-relaxed whitespace-pre-wrap mb-4 pl-11">
                                        {post.content}
                                    </div>
                                    <div className="flex gap-4 pl-11">
                                        <button className="flex items-center gap-1.5 text-xs text-textMuted hover:text-red-400 transition-colors">
                                            <Heart size={14} />
                                            <span>{post.likes.length}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-xs text-textMuted hover:text-primary transition-colors">
                                            <MessageSquare size={14} />
                                            <span>Reply</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* MEMBERS TAB */}
            {activeTab === 'members' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Mocking fetching members for now since we store IDs only. 
                         In real app we would query 'users where id in tribe.members'.
                         For now we just show a placeholder or mock items. 
                     */}
                    <div className="col-span-full p-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg text-sm mb-4">
                        Showing all {tribe.members.length} members (Mock Data for Demo)
                    </div>

                    {[...Array(tribe.members.length)].map((_, i) => (
                        <div key={i} className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-textMain">
                                    U{i + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-textMain">User {i + 1}</div>
                                    <div className="text-[10px] text-textMuted">Member</div>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-textMuted hover:text-primary" title="Add Friend">
                                    <UserPlus size={16} />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-textMuted hover:text-accent" title="Message">
                                    <MessageSquare size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
