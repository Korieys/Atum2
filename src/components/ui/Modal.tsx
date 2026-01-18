import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    showCloseButton?: boolean;
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    className,
    showCloseButton = true
}: ModalProps) => {

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    "relative w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl animate-in zoom-in-95 duration-200",
                    className
                )}
            >
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-border/50">
                        {title && <h3 className="font-bold text-lg text-textMain">{title}</h3>}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-textMuted hover:text-textMain transition-colors ml-auto"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
