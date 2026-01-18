import { useState, useEffect } from 'react';
import { useAtumStore } from '../store/useAtumStore';
import { useNavigate } from 'react-router-dom';
import { Loader2, Settings as SettingsIcon, Save, LogOut } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';

export const Settings = () => {
    const navigate = useNavigate();
    const { userProfile, updateProfile, signOut, fetchGitHubCommits } = useAtumStore();
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        role: 'Engineer',
        currentlyBuilding: '',
        phase: 'Phase 1: Stealth Build',
        stats: { reach: '12.5k' },
        socials: {
            twitter: '',
            github: '',
            linkedin: '',
            youtube: '',
            website: ''
        },
        githubConfig: {
            repo: '',
            token: ''
        }
    });

    useEffect(() => {
        if (userProfile) {
            setFormData({
                username: userProfile.username || '',
                bio: userProfile.bio || '',
                role: userProfile.role || 'Engineer',
                currentlyBuilding: userProfile.currentlyBuilding || '',
                phase: userProfile.phase || 'Phase 1: Stealth Build',
                stats: { reach: userProfile.stats?.reach || '0' },
                socials: {
                    twitter: userProfile.socials?.twitter || '',
                    github: userProfile.socials?.github || '',
                    linkedin: userProfile.socials?.linkedin || '',
                    youtube: userProfile.socials?.youtube || '',
                    website: userProfile.socials?.website || ''
                },
                githubConfig: {
                    repo: userProfile.githubConfig?.repo || '',
                    token: userProfile.githubConfig?.token || ''
                }
            });
        }
    }, [userProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMsg({ type: '', text: '' });

        try {
            await updateProfile({
                ...userProfile!,
                username: formData.username,
                bio: formData.bio,
                phase: formData.phase,
                stats: formData.stats,
                socials: formData.socials,
                githubConfig: formData.githubConfig
            });
            setMsg({ type: 'success', text: 'Profile & Integrations updated.' });
        } catch (error) {
            console.error(error);
            setMsg({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        if (window.confirm("Are you sure you want to sign out?")) {
            await signOut();
            navigate('/login');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between p-6 rounded-2xl border border-border bg-surface">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-textMain">
                        <SettingsIcon className="text-primary" />
                        System Configuration
                    </h1>
                    <p className="text-textMuted text-sm">Manage your identity and mission parameters.</p>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                >
                    <LogOut size={16} />
                    Terminate Session
                </button>
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-border bg-surface space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-textMuted mb-4">Identity Module</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-textMuted uppercase">Email Access</label>
                                <input
                                    type="email"
                                    disabled
                                    value={userProfile?.email || ''}
                                    className="w-full bg-surfaceHighlight border border-border rounded-lg p-3 text-textMuted cursor-not-allowed opacity-70"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-textMuted uppercase">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-textMuted uppercase">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors"
                                >
                                    <option value="Engineer">Engineer</option>
                                    <option value="Founder">Founder</option>
                                    <option value="Product">Product Manager</option>
                                    <option value="Creator">Content Creator</option>
                                </select>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-bold text-textMuted uppercase">Mission Phase</label>
                                <select
                                    value={formData.phase}
                                    onChange={e => setFormData({ ...formData, phase: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors"
                                >
                                    <option value="Phase 1: Stealth Build">Phase 1: Stealth Build</option>
                                    <option value="Phase 2: Public Beta">Phase 2: Public Beta</option>
                                    <option value="Phase 3: User Acquisition">Phase 3: User Acquisition</option>
                                    <option value="Phase 4: Revenue Growth">Phase 4: Revenue Growth</option>
                                    <option value="Phase 5: Market Dominance">Phase 5: Market Dominance</option>
                                </select>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-bold text-textMuted uppercase">Currently Building</label>
                                <input
                                    type="text"
                                    value={formData.currentlyBuilding}
                                    onChange={e => setFormData({ ...formData, currentlyBuilding: e.target.value })}
                                    className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors"
                                    placeholder="Project Name (e.g. Project Onyx)"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-textMuted uppercase">Mission Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors h-24 resize-none"
                            />
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-textMuted mb-4">Integrations Module</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-textMuted uppercase">GitHub Repo (owner/repo)</label>
                                    <input
                                        type="text"
                                        value={formData.githubConfig.repo}
                                        onChange={e => setFormData({
                                            ...formData,
                                            githubConfig: { ...formData.githubConfig, repo: e.target.value }
                                        })}
                                        className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors"
                                        placeholder="antigravity/atum"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-textMuted uppercase">GitHub Token (Optional)</label>
                                    <input
                                        type="password"
                                        value={formData.githubConfig.token}
                                        onChange={e => setFormData({
                                            ...formData,
                                            githubConfig: { ...formData.githubConfig, token: e.target.value }
                                        })}
                                        className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors"
                                        placeholder="ghp_..."
                                    />
                                    <p className="text-[10px] text-textMuted">Required for private repos or high volume traffic.</p>
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="button"
                                        onClick={() => fetchGitHubCommits().then(() => alert('Sync initiated! Check dashboard activity.'))}
                                        className="text-xs font-mono text-primary hover:underline"
                                    >
                                        [TEST CONNECTION & SYNC LOGS]
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-textMuted mb-4">Metrics Calibration</h2>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-textMuted uppercase">Estimated Reach</label>
                                <input
                                    type="text"
                                    value={formData.stats.reach}
                                    onChange={e => setFormData({ ...formData, stats: { ...formData.stats, reach: e.target.value } })}
                                    className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:border-primary focus:outline-none transition-colors"
                                    placeholder="e.g. 12.5k"
                                />
                                <p className="text-[10px] text-textMuted">Manual override enabled until API sync modules are online.</p>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            {msg.text && (
                                <span className={`text-xs mr-4 py-2 ${msg.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                    {msg.text}
                                </span>
                            )}
                            <ActionButton primary type="submit" disabled={isLoading} className="px-6">
                                {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                SAVE_CONFIG
                            </ActionButton>
                        </div>
                    </form>
                </div>

                {/* Account Actions / Info */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-border bg-surfaceHighlight/5">
                        <h3 className="font-bold text-sm mb-2">Account Status</h3>
                        <div className="space-y-2 text-xs text-textMuted">
                            <div className="flex justify-between">
                                <span>Plan</span>
                                <span className="text-primary font-mono">EARLY_ACCESS</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Member Since</span>
                                <span className="font-mono">2024</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
