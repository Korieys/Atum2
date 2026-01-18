import { Modal } from './Modal';
import { ActionButton } from './ActionButton';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmationModalProps) => {

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-md">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    <AlertTriangle size={32} />
                </div>

                <div className="space-y-2">
                    <h3 className="font-bold text-xl text-textMain">{title}</h3>
                    <p className="text-textMuted">{message}</p>
                </div>

                <div className="flex gap-3 w-full pt-4">
                    <ActionButton
                        onClick={onClose}
                        className="flex-1 justify-center bg-transparent border border-border hover:bg-white/5"
                    >
                        {cancelText}
                    </ActionButton>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${variant === 'danger'
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_-3px_rgba(239,68,68,0.4)]'
                            : 'bg-primary hover:bg-primary/90 text-black shadow-[0_0_15px_-3px_rgba(var(--primary),0.4)]'
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
