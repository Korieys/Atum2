import { useState } from 'react';
import { Modal } from './ui/Modal';
import { ActionButton } from './ui/ActionButton';
import { useAtumStore } from '../store/useAtumStore';
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

interface CreateTribeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateTribeModal = ({ isOpen, onClose }: CreateTribeModalProps) => {
    const { createTribe } = useAtumStore();
    const { addNotification } = useNotificationStore();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [banner, setBanner] = useState(BANNER_OPTIONS[0]);

    const handleCreate = async () => {
        if (!name || !description) return;

        setIsLoading(true);
        try {
            await createTribe({
                name,
                description,
                banner,
                createdAt: new Date()
            });

            addNotification({
                type: 'success',
                title: 'Tribe Created',
                message: `You founded ${name}!`
            });
            onClose();
            setName('');
            setDescription('');
        } catch (error) {
            addNotification({
                type: 'error',
                title: 'Creation Failed',
                message: 'Could not create tribe.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-textMain">Found a New Tribe</h2>
                    <p className="text-textMuted text-sm">Create a community for like-minded builders.</p>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1 custom-scrollbar">
                    {/* Banner Selection */}
                    <div>
                        <label className="text-xs font-bold uppercase text-textMuted block mb-2">Tribe Banner</label>
                        <div className="grid grid-cols-2 gap-4">
                            {BANNER_OPTIONS.map((bannerPath) => (
                                <button
                                    key={bannerPath}
                                    onClick={() => setBanner(bannerPath)}
                                    className={cn(
                                        "h-20 rounded-lg relative overflow-hidden transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-surface bg-cover bg-center bg-surfaceHighlight",
                                        banner === bannerPath && "ring-2 ring-primary ring-offset-1 ring-offset-surface scale-105"
                                    )}
                                    style={{ backgroundImage: `url(${bannerPath})` }}
                                >
                                    {banner === bannerPath && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                            <Check size={24} className="text-primary drop-shadow-md" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-textMuted">Tribe Name</label>
                        <input
                            className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Indie Hackers"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-textMuted">Mission / Description</label>
                        <textarea
                            className="w-full bg-background border border-border rounded p-2 text-textMain focus:border-primary focus:outline-none h-24 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this tribe about?"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <ActionButton onClick={onClose} type="button" className="bg-transparent border border-border hover:bg-white/5">Cancel</ActionButton>
                    <ActionButton primary onClick={handleCreate} disabled={!name || !description || isLoading}>
                        {isLoading ? 'Creating...' : 'Create Tribe'}
                    </ActionButton>
                </div>
            </div>
        </Modal>
    );
};
