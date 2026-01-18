import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react';
import { useNotificationStore, type Notification } from '../../store/useNotificationStore';
import { cn } from '../../lib/utils';

export const ToastNotification = () => {
    const { notifications, removeNotification } = useNotificationStore();

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            {notifications.map((n) => (
                <ToastItem key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
            ))}
        </div>
    );
};

const ToastItem = ({ notification, onClose }: { notification: Notification; onClose: () => void }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for animation
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'success': return <CheckCircle size={16} className="text-black" />;
            case 'error': return <AlertTriangle size={16} className="text-white" />;
            case 'alert': return <Zap size={16} className="text-black" />; // Major alert
            default: return <Info size={16} className="text-primary" />;
        }
    };

    const getStyles = () => {
        switch (notification.type) {
            case 'success': return "bg-primary text-black border-primary";
            case 'error': return "bg-red-500 text-white border-red-500";
            case 'alert': return "bg-accent text-black border-accent shadow-[0_0_20px_rgba(255,107,43,0.4)]"; // Orange glow
            default: return "bg-surface border-border text-textMain border-l-4 border-l-primary";
        }
    };

    return (
        <div className={cn(
            "pointer-events-auto w-80 p-4 rounded-lg border shadow-xl transition-all duration-300 transform translate-x-0 relative overflow-hidden",
            getStyles(),
            isExiting ? "translate-x-full opacity-0" : "animate-in slide-in-from-right-full fade-in"
        )}>
            {/* Scanline for Alert */}
            {notification.type === 'alert' && (
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none" />
            )}

            <div className="flex gap-3 relative z-10">
                <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center shrink-0",
                    notification.type === 'info' ? "bg-surfaceHighlight" : "bg-white/20"
                )}>
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-1">{notification.title}</h4>
                    <p className="text-xs opacity-90 leading-relaxed font-mono">{notification.message}</p>
                </div>
                <button onClick={handleClose} className="opacity-50 hover:opacity-100 transition-opacity self-start">
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};
