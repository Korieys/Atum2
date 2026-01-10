import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Layout as LayoutIcon,
    Activity,
    PenTool,
    Share2,
    Users,
    Lightbulb
} from 'lucide-react';
import { cn } from '../../lib/utils';

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

            <div className="p-4 border-t border-border">
                <div className="bg-surfaceHighlight rounded-lg p-4">
                    <h4 className="text-xs font-bold text-textMain mb-1">Status: Online</h4>
                    <div className="flex items-center gap-2 text-[10px] text-textMuted">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Syncing changes...
                    </div>
                </div>
            </div>
        </aside>
    );
};
