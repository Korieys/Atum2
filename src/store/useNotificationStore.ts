import { create } from 'zustand';

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'info' | 'alert';
    title: string;
    message: string;
    duration?: number;
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (notification) => {
        const id = Math.random().toString(36).substring(7);
        set((state) => ({
            notifications: [...state.notifications, { ...notification, id }]
        }));

        if (notification.duration !== 0) { // 0 = persistent
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id)
                }));
            }, notification.duration || 5000);
        }
    },
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
    }))
}));
