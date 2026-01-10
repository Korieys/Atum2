import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Layout as LayoutIcon,
    Activity,
    PenTool,
    Share2,
    Users,
    Lightbulb,
    Settings
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAtumStore } from '../../store/useAtumStore';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    to: string;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, to, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative",
            active ? "bg-white/10" : "hover:bg-white/5"
        )}
    >
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
        <div className={cn("transition-colors duration-200", active ? "text-primary" : "text-textMuted")}>
            {icon}
        </div>
        <span className={cn("font-medium transition-colors duration-200", active ? "text-textMain" : "text-textMuted")}>
            {label}
        </span>
    </Link>
);

export const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen?: boolean, setMobileMenuOpen?: (open: boolean) => void }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const { userProfile, isLoading, error } = useAtumStore();

    // Simple active check: strictly equal or starts with for sub-routes
    const isActive = (path: string) => currentPath === path || (path !== '/' && currentPath.startsWith(path));

    const navItems = [
        { label: 'Mission Control', icon: <LayoutIcon size={18} />, path: '/app' },
        { label: 'Tracker', icon: <Activity size={18} />, path: '/app/tracker' },
        { label: 'Narrative', icon: <PenTool size={18} />, path: '/app/narrative' },
        { label: 'Ideas', icon: <Lightbulb size={18} />, path: '/app/ideas' },
        { label: 'Publisher', icon: <Share2 size={18} />, path: '/app/publisher' },
        { label: 'Community', icon: <Users size={18} />, path: '/app/community' },
    ];

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 border-r border-border flex flex-col bg-surface",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="p-6 border-b border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(210,255,40,0.3)]">
                    <span className="font-bold text-black font-mono">A</span>
                </div>
                <div>
                    <h1 className="font-bold text-xl tracking-tight text-textMain">Atum</h1>
                    <p className="text-[10px] text-textMuted uppercase tracking-widest">BuildOS v0.1</p>
                </div>
            </div>

            <nav className="flex-1 py-6 space-y-1">
                {navItems.map(item => (
                    <SidebarItem
                        key={item.path}
                        to={item.path}
                        icon={item.icon}
                        label={item.label}
                        active={isActive(item.path)}
                        onClick={() => setMobileMenuOpen?.(false)}
                    />
                ))}
            </nav>

            <div className="p-4 border-t border-border space-y-4">
                {/* User Profile / Settings Link */}
                <Link to="/app/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group">
                    <div className="w-8 h-8 rounded bg-surfaceHighlight border border-border flex items-center justify-center text-xs font-bold text-primary">
                        {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-textMain truncate">{userProfile?.username || 'User'}</p>
                        <p className="text-[10px] text-textMuted truncate">{userProfile?.role || 'Engineer'}</p>
                    </div>
                    <Settings size={14} className="text-textMuted group-hover:text-primary transition-colors" />
                </Link>

                {/* Status Indicator */}
                <div className="bg-surfaceHighlight/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[10px] font-bold text-textMuted uppercase tracking-wider">System Status</h4>
                        <span className={`text-[10px] font-bold ${error ? 'text-red-500' : 'text-primary'}`}>
                            {error ? 'ERR' : 'OK'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-textMuted">
                        <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-accent animate-pulse' : (error ? 'bg-red-500' : 'bg-green-500')}`} />
                        {isLoading ? 'Syncing...' : (error ? 'Offline' : 'Connected')}
                    </div>
                </div>
            </div>
        </aside>
    );
};
