import { useState, useMemo } from 'react';
import { useAtumStore } from '../store/useAtumStore';
import { auth } from '../lib/firebase';
import type { UserProfile } from '../store/useAtumStore';
import { useNavigate } from 'react-router-dom';
import { Loader2, TerminalSquare, Twitter, Linkedin, Youtube, ChevronRight, Github } from 'lucide-react';
import { ALL_TECH_OPTIONS } from '../constants/techOptions';

export const Onboarding = () => {
    const navigate = useNavigate();
    const updateProfile = useAtumStore(state => state.updateProfile);

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        role: 'Engineer',
        techStack: [] as string[],
        socials: {
            twitter: '',
            github: '',
            linkedin: '',
            youtube: '',
            website: ''
        }
    });

    const filteredTech = useMemo(() => {
        if (!tagInput) return [];
        return ALL_TECH_OPTIONS.filter(tech =>
            tech.toLowerCase().includes(tagInput.toLowerCase()) &&
            !formData.techStack.includes(tech)
        ).slice(0, 5);
    }, [tagInput, formData.techStack]);

    const handleTagAdd = (tech: string) => {
        if (!formData.techStack.includes(tech)) {
            setFormData(prev => ({
                ...prev,
                techStack: [...prev.techStack, tech]
            }));
        }
        setTagInput('');
        setShowSuggestions(false);
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter(t => t !== tag)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        if (!auth.currentUser) {
            setErrorMsg("Session expired. Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
            if (!formData.username) throw new Error("Username is required");

            await updateProfile({
                username: formData.username,
                bio: formData.bio,
                role: formData.role,
                techStack: formData.techStack,
                socials: formData.socials
            } as UserProfile);

            navigate('/app');
        } catch (error: any) {
            console.error("Onboarding Error:", error);
            if (error.code === 'unavailable' || error.message?.includes("offline")) {
                setErrorMsg("Network Error: Client is offline. Check your internet or ad-blockers.");
            } else if (error.message?.includes("network")) {
                setErrorMsg("Network Error. Check your connection.");
            } else {
                setErrorMsg(error.message || "Failed to save profile.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-primary font-mono p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

            <div className="w-full max-w-2xl border border-primary/30 bg-black/90 p-6 md:p-10 rounded-lg shadow-[0_0_20px_rgba(210,255,40,0.2)] relative z-10">
                <div className="flex items-center gap-3 mb-8 border-b border-primary/30 pb-4">
                    <TerminalSquare className="text-primary" size={32} />
                    <div>
                        <h1 className="text-2xl font-bold tracking-tighter">BUILD_OS v1.0</h1>
                        <p className="text-xs text-primary/60">INITIALIZING USER PROFILE...</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {errorMsg && (
                        <div className="border border-red-500/50 bg-red-900/20 text-red-400 p-3 text-sm">
                            [ERROR] {errorMsg}
                        </div>
                    )}

                    {/* Identity Section */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 border-b border-primary/20 pb-1">01. Identity</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs opacity-70">USERNAME</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-black border border-primary/40 p-3 text-primary focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(210,255,40,0.3)] transition-all placeholder:text-primary/30"
                                    placeholder="root_user"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs opacity-70">ROLE</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-black border border-primary/40 p-3 text-primary focus:outline-none focus:border-primary cursor-pointer"
                                >
                                    <option value="Engineer"> ENGINEER</option>
                                    <option value="Founder"> FOUNDER</option>
                                    <option value="Designer"> DESIGNER</option>
                                    <option value="Product"> PRODUCT_MGR</option>
                                    <option value="Creator"> CONTENT_CREATOR</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs opacity-70">BIO</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full h-24 bg-black border border-primary/40 p-3 text-primary focus:outline-none focus:border-primary text-sm placeholder:text-primary/30 resize-none"
                                placeholder="Execute your mission statement..."
                            />
                        </div>
                    </div>

                    {/* Tech Stack Section */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 border-b border-primary/20 pb-1">02. Arsenal</h2>

                        <div className="space-y-2 relative">
                            <label className="text-xs opacity-70">TECH STACK</label>
                            <div className="flex flex-wrap gap-2 mb-2 min-h-[30px]">
                                {formData.techStack.map(tag => (
                                    <span key={tag} className="bg-primary/10 border border-primary/40 px-2 py-1 text-xs flex items-center gap-2 hover:bg-primary/20 transition-colors cursor-default">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary/80">×</button>
                                    </span>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={tagInput}
                                onChange={e => {
                                    setTagInput(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                className="w-full bg-black border border-primary/40 p-3 text-primary focus:outline-none focus:border-primary placeholder:text-primary/30"
                                placeholder="Add technologies..."
                            />

                            {/* Autocomplete Dropdown */}
                            {showSuggestions && filteredTech.length > 0 && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-black border border-primary/50 z-50 shadow-xl max-h-40 overflow-y-auto">
                                    {filteredTech.map(tech => (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => handleTagAdd(tech)}
                                            className="w-full text-left px-4 py-2 hover:bg-primary/20 text-primary text-sm border-b border-primary/30 last:border-0"
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Socials Section */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-primary/80 border-b border-primary/20 pb-1">03. Network Uplink</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Twitter size={16} className="opacity-70" />
                                <input
                                    type="text"
                                    value={formData.socials.twitter}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, twitter: e.target.value } })}
                                    className="w-full bg-black border-b border-primary/30 py-2 text-primary focus:outline-none focus:border-primary placeholder:text-primary/30 text-sm"
                                    placeholder="Twitter Handle"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Github size={16} className="opacity-70" />
                                <input
                                    type="text"
                                    value={formData.socials.github}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, github: e.target.value } })}
                                    className="w-full bg-black border-b border-primary/30 py-2 text-primary focus:outline-none focus:border-primary placeholder:text-primary/30 text-sm"
                                    placeholder="GitHub Username"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Linkedin size={16} className="opacity-70" />
                                <input
                                    type="text"
                                    value={formData.socials.linkedin}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })}
                                    className="w-full bg-black border-b border-primary/30 py-2 text-primary focus:outline-none focus:border-primary placeholder:text-primary/30 text-sm"
                                    placeholder="LinkedIn URL"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Youtube size={16} className="opacity-70" />
                                <input
                                    type="text"
                                    value={formData.socials.youtube}
                                    onChange={e => setFormData({ ...formData, socials: { ...formData.socials, youtube: e.target.value } })}
                                    className="w-full bg-black border-b border-primary/30 py-2 text-primary focus:outline-none focus:border-primary placeholder:text-primary/30 text-sm"
                                    placeholder="YouTube Channel"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-black font-bold uppercase py-4 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 tracking-widest mt-8 group disabled:opacity-50 shadow-[0_0_15px_rgba(210,255,40,0.4)]"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Initialize System <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
