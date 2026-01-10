import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';
import { useAtumStore } from '../../store/useAtumStore';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { fetchData } = useAtumStore();

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex bg-background min-h-screen text-textMain font-sans selection:bg-primary/30 selection:text-black overflow-hidden">

            {/* Mobile Header Overlay (only visible on small screens) */}
            <div className="fixed top-0 left-0 right-0 z-40 lg:hidden flex items-center justify-between p-4 border-b border-border bg-surface">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                        <span className="font-bold text-black">A</span>
                    </div>
                    <span className="font-bold text-lg text-textMain">Atum</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-textMain">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <main className="flex-1 h-screen overflow-y-scroll pt-16 lg:pt-0 scroll-smooth">
                <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
};
