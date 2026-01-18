
import { useState, useEffect } from 'react';
import { MessageSquare, Users, Plus, Search, UserPlus, Star } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { Badge } from '../components/ui/Badge';
import { useAtumStore } from '../store/useAtumStore';
import { cn } from '../lib/utils';
import { EditProfileModal } from '../components/EditProfileModal';
import { CreateTribeModal } from '../components/CreateTribeModal';
import { useNavigate } from 'react-router-dom';

export const Community = () => {
    const navigate = useNavigate();
    const {
        communityUpdates,
        fetchCommunity,
        isLoading,
        userProfile,
        tribes,
        fetchTribes,
        sendFriendRequest,
        friendRequests,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend
    } = useAtumStore();

    const [activeTab, setActiveTab] = useState<'discover' | 'my-tribes' | 'friends'>('discover');
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isCreateTribeOpen, setIsCreateTribeOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCommunity();
        fetchTribes();
    }, []);

    const filteredTribes = tribes.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort Discover tribes by popularity (member count)
    const discoverTribes = filteredTribes
        .filter(t => !t.members.includes(userProfile?.id || ''))
        .sort((a, b) => b.members.length - a.members.length);

    const myTribes = filteredTribes.filter(t => t.members.includes(userProfile?.id || ''));

    // Friend Logic
    // If search query exists, search ALL builders (to find new friends).
    // If no search, show ONLY my accepted friends.
    const myFriendIds = userProfile?.friends || [];

    const displayedUsers = searchQuery
        ? communityUpdates.filter(u => u.id !== userProfile?.id && u.username.toLowerCase().includes(searchQuery.toLowerCase()))
        : communityUpdates.filter(u => myFriendIds.includes(u.id || ''));

    // Incoming Requests (Pending and To Me)
    const incomingRequests = friendRequests.filter(r => r.toId === userProfile?.id && r.status === 'pending');

    if (isLoading && !userProfile) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-48 bg-white/5 rounded-xl border border-white/5"></div>
            </div>
        );
    }

    // Dynamic Search Border styling
    const getSearchBorderClass = () => {
        switch (activeTab) {
            case 'discover': return "focus:border-primary"; // Default Green
            case 'my-tribes': return "focus:border-accent"; // Matches My Tribes accent logic if any (purple/pink)
            case 'friends': return "focus:border-blue-400"; // Friends blueish tone
            default: return "focus:border-primary";
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
            <CreateTribeModal isOpen={isCreateTribeOpen} onClose={() => setIsCreateTribeOpen(false)} />

            {/* User Profile Header */}
            {userProfile && (
                <div
                    className={cn(
                        "relative rounded-2xl overflow-hidden min-h-[14rem] mb-8 border border-border flex flex-col justify-end p-6 bg-cover bg-center",
                        !userProfile.banner?.startsWith('/') && (userProfile.banner || "bg-gradient-to-r from-surface to-surfaceHighlight")
                    )}
                    style={userProfile.banner?.startsWith('/') ? { backgroundImage: `url(${userProfile.banner})` } : {}}
                >
                    {(!userProfile.banner || (!userProfile.banner.startsWith('/') && !userProfile.banner.includes('gradient'))) && (
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(#d2ff28 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
                    )}
                    {userProfile.banner?.startsWith('/') && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                    )}

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 w-full justify-between">
                        <div className="flex items-end gap-6">
                            <div className="w-24 h-24 rounded-xl border-4 border-background shadow-xl flex items-center justify-center bg-primary text-black text-4xl font-bold shrink-0">
                                {userProfile?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="mb-1">
                                <h1 className="text-3xl font-bold text-white drop-shadow-md">{userProfile.username}</h1>
                                <p className="text-white/90 font-medium mb-1 drop-shadow-sm">{userProfile.role || "Builder"}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <ActionButton onClick={() => setIsEditProfileOpen(true)} className="bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md shadow-lg">Edit Profile</ActionButton>
                            <ActionButton onClick={() => setIsCreateTribeOpen(true)} primary shadow>
                                <Plus size={16} /> New Tribe
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex p-1 bg-surface border border-border rounded-lg self-start">
                    {(['discover', 'my-tribes', 'friends'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-300",
                                activeTab === tab ? "bg-primary text-black shadow-sm" : "text-textMuted hover:text-textMain hover:bg-white/5"
                            )}
                        >
                            {tab === 'discover' && 'Discover Tribes'}
                            {tab === 'my-tribes' && 'My Tribes'}
                            {tab === 'friends' && 'Friends'}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted transition-colors duration-300" size={16}
                        style={{ color: activeTab === 'friends' ? '#60a5fa' : '' }}
                    />
                    <input
                        className={cn(
                            "w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-textMain focus:outline-none placeholder:text-textMuted transition-all duration-300",
                            getSearchBorderClass()
                        )}
                        placeholder={activeTab === 'friends' ? "Search for friends..." : "Search tribes..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8">
                {/* DISCOVER TAB */}
                {activeTab === 'discover' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {discoverTribes.length === 0 ? (
                            <div className="col-span-full text-center p-12 border border-dashed border-border rounded-xl bg-surface/30">
                                <Users className="mx-auto text-textMuted mb-3" size={48} />
                                <h3 className="text-lg font-bold text-textMain">No New Tribes Found</h3>
                                <p className="text-textMuted">Create one to start a movement!</p>
                            </div>
                        ) : (
                            discoverTribes.map(tribe => (
                                <div
                                    key={tribe.id}
                                    onClick={() => navigate(`/app/tribes/${tribe.id}`)}
                                    className="group relative bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg flex flex-col cursor-pointer"
                                >
                                    <div
                                        className={cn("h-24 w-full bg-cover bg-center", !tribe.banner?.startsWith('/') && tribe.banner)}
                                        style={tribe.banner?.startsWith('/') ? { backgroundImage: `url(${tribe.banner})` } : {}}
                                    ></div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-textMain mb-1">{tribe.name}</h3>
                                        <p className="text-sm text-textMuted mb-4 line-clamp-2 flex-1">{tribe.description}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-2 text-xs text-textMuted">
                                                <Users size={14} />
                                                <span>{tribe.members.length} members</span>
                                            </div>
                                            {/* Popularity Badge */}
                                            {tribe.members.length > 5 && (
                                                <Badge variant="accent" className="text-[10px]"><Star size={10} className="mr-1" /> Popular</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* MY TRIBES TAB */}
                {activeTab === 'my-tribes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myTribes.map(tribe => (
                            <div
                                key={tribe.id}
                                onClick={() => navigate(`/app/tribes/${tribe.id}`)}
                                className="group relative bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg flex flex-col cursor-pointer"
                            >
                                <div
                                    className={cn("h-24 w-full bg-cover bg-center", !tribe.banner?.startsWith('/') && tribe.banner)}
                                    style={tribe.banner?.startsWith('/') ? { backgroundImage: `url(${tribe.banner})` } : {}}
                                >
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="accent">Member</Badge>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-textMain mb-1">{tribe.name}</h3>
                                    <p className="text-sm text-textMuted mb-4 line-clamp-2 flex-1">{tribe.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2 text-xs text-textMuted">
                                            <Users size={14} />
                                            <span>{tribe.members.length} members</span>
                                        </div>
                                        <span className="text-xs text-primary font-bold">Open Tribe &rarr;</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FRIENDS TAB */}
                {activeTab === 'friends' && (
                    <div className="space-y-8">
                        {/* INCOMING REQUESTS SECTION */}
                        {incomingRequests.length > 0 && (
                            <div className="bg-surfaceHighlight/10 border border-primary/20 rounded-xl p-6 animate-in slide-in-from-top-2">
                                <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                                    <UserPlus size={18} /> Incoming Friend Requests
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {incomingRequests.map(req => {
                                        const sender = communityUpdates.find(u => u.id === req.fromId);
                                        if (!sender) return null;
                                        return (
                                            <div key={req.id} className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                                                        {sender.username?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-textMain">{sender.username}</div>
                                                        <div className="text-xs text-textMuted">Wants to connect</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <ActionButton onClick={() => acceptFriendRequest(req.id)} primary className="py-1 px-3 text-xs h-8">Accept</ActionButton>
                                                    <button onClick={() => rejectFriendRequest(req.id)} className="px-3 py-1 rounded-md hover:bg-white/10 text-textMuted text-xs transition-colors">Ignore</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* FRIENDS LIST & SEARCH RESULTS */}
                        {displayedUsers.length === 0 ? (
                            <div className="col-span-full text-center p-12 border border-dashed border-border rounded-xl bg-surface/30">
                                <p className="text-textMuted mb-2">{searchQuery ? "No users found." : "You haven't added any friends yet."}</p>
                                {!searchQuery && <p className="text-xs text-textMuted">Search above to find builders to connect with.</p>}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayedUsers.map((p) => {
                                    const isFriend = userProfile?.friends?.includes(p.id || '');
                                    const hasSentRequest = friendRequests.some(r => r.fromId === userProfile?.id && r.toId === p.id && r.status === 'pending');

                                    return (
                                        <div key={p.id} className="p-5 rounded-xl border border-border bg-surface flex flex-col group relative">
                                            {/* Friend Controls (Request to add: remove/block menu) */}
                                            {isFriend && (
                                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Remove ${p.username} from friends?`)) {
                                                                removeFriend(p.id || '');
                                                            }
                                                        }}
                                                        className="text-textMuted hover:text-red-500 transition-colors p-1"
                                                        title="Remove Friend"
                                                    >
                                                        <Users size={16} /> {/* Using Users icon with slash concept or just X */}
                                                        <span className="sr-only">Remove</span>
                                                    </button>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                                                        {p.username?.[0]?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-textMain">{p.username}</p>
                                                        <p className="text-xs text-textMuted">{p.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm mb-4 leading-relaxed text-textMain line-clamp-2 flex-1">
                                                {p.bio || "Just started building."}
                                            </p>

                                            <div className="flex gap-4 border-t border-border pt-4 mt-auto">
                                                {isFriend ? (
                                                    <button className="w-full flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg bg-surfaceHighlight text-textMain hover:bg-white/10 transition-colors">
                                                        <MessageSquare size={14} /> Message
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (p.id && !hasSentRequest) sendFriendRequest(p.id);
                                                        }}
                                                        disabled={hasSentRequest}
                                                        className={cn(
                                                            "w-full flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg transition-colors border border-border",
                                                            hasSentRequest
                                                                ? "bg-transparent text-textMuted cursor-not-allowed"
                                                                : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                                        )}
                                                    >
                                                        {hasSentRequest ? "Request Sent" : <><UserPlus size={14} /> Add Friend</>}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
