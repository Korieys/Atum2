import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { ActionButton } from './ui/ActionButton';
import { useAtumStore, type UserProfile } from '../store/useAtumStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

const BANNER_OPTIONS = [
    "/banners/banner-1.jpg",
    "/banners/banner-2.jpg",
    "/banners/banner-3.png",
    "/banners/banner-4.jpg",
    "/banners/banner-5.jpg"
];

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { userProfile, updateProfile } = useAtumStore();
    const { addNotification } = useNotificationStore();
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState<Partial<UserProfile>>({
        username: '',
        bio: '',
        role: '',
        currentlyBuilding: '',
        banner: BANNER_OPTIONS[0],
        techStack: []
    });

    const [techInput, setTechInput] = useState('');

    useEffect(() => {
        if (userProfile) {
            setForm({
                username: userProfile.username || '',
                bio: userProfile.bio || '',
                role: userProfile.role || '',
                currentlyBuilding: userProfile.currentlyBuilding || '',
                // If existing banner follows a pattern (class), use it, else default
                banner: userProfile.banner || BANNER_OPTIONS[0],
                techStack: userProfile.techStack || []
            });
        }
    }, [userProfile, isOpen]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (userProfile) {
                await updateProfile({
                    ...userProfile,
                    ...form
                } as UserProfile);

                addNotification({
                    type: 'success',
                    title: 'Profile Updated',
                    message: 'Your profile changes have been saved.'
                });
                onClose();
            }
        } catch (error) {
            console.error(error);
            addNotification({
                type: 'error',
                title: 'Update Failed',
                message: 'Could not save profile.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addTech = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!form.techStack?.includes(techInput.trim())) {
                setForm(prev => ({ ...prev, techStack: [...(prev.techStack || []), techInput.trim()] }));
            }
            setTechInput('');
        }
    };

    const removeTech = (tag: string) => {
        setForm(prev => ({ ...prev, techStack: prev.techStack?.filter(t => t !== tag) }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-textMain">Edit Public Profile</h2>
                    <p className="text-textMuted text-sm">Update your builder identity.</p>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-4 pr-2 custom-scrollbar">
                    {/* Banner Selection */}
                    <div>
                        <label className="text-xs font-bold uppercase text-textMuted block mb-2">Profile Banner</label>
                        <div className="grid grid-cols-2 gap-4">
                            {BANNER_OPTIONS.map((bannerPath) => (
                                <button
                                    key={bannerPath}
                                    onClick={() => setForm(prev => ({ ...prev, banner: bannerPath }))}
                                    className={cn(
                                        "h-20 rounded-lg relative overflow-hidden transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface bg-cover bg-center bg-surfaceHighlight",
                                        form.banner === bannerPath && "ring-2 ring-primary ring-offset-1 ring-offset-surface scale-105"
                                    )}
                                    style={{ backgroundImage: `url(${bannerPath})` }}
                                >
                                    {form.banner === bannerPath && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                            <Check size={24} className="text-primary drop-shadow-md" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-textMuted">Username</label>
                            <input
                                className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none"
                                value={form.username}
                                onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-textMuted">Role</label>
                            <input
                                className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none"
                                value={form.role}
                                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                                placeholder="e.g. Frontend Engineer"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-textMuted">Bio</label>
                        <textarea
                            className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none h-20 resize-none"
                            value={form.bio}
                            onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell the tribe about yourself..."
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-textMuted">Currently Building</label>
                        <input
                            className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none"
                            value={form.currentlyBuilding}
                            onChange={(e) => setForm(prev => ({ ...prev, currentlyBuilding: e.target.value }))}
                            placeholder="What are you working on?"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-textMuted">Tech Stack (Press Enter)</label>
                        <input
                            className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={addTech}
                            placeholder="React, Node.js, etc."
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {form.techStack?.map(tag => (
                                <span key={tag} className="bg-surfaceHighlight text-xs px-2 py-1 rounded flex items-center gap-1 group">
                                    {tag}
                                    <button onClick={() => removeTech(tag)} className="hover:text-red-500"><Check className="hidden" /><span className="text-[10px]">✕</span></button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <ActionButton onClick={onClose} type="button" className="bg-transparent border border-border hover:bg-white/5">Cancel</ActionButton>
                    <ActionButton primary onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Profile'}
                    </ActionButton>
                </div>
            </div>
        </Modal>
    );
};
