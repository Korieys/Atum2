import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';
import { useAtumStore } from '../../store/useAtumStore';
import { useNavigate } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const {
        isInitialized,
        userProfile,
        fetchData,
        error
    } = useAtumStore();

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        // If initialized and no profile AND NO ERROR, redirect to onboarding
        if (isInitialized && !userProfile && !error) {
            navigate('/app/onboarding');
        }
    }, [isInitialized, userProfile, navigate, error]);

    return (
        <div className="flex h-screen bg-background text-textMain overflow-hidden font-sans">
            {/* Sidebar */}
            <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-surface/50 backdrop-blur-md z-20">
                    <div className="font-bold text-xl tracking-tight">Atum</div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-textMuted hover:text-primary transition-colors">
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </header>

                <main className="flex-1 overflow-y-scroll scroll-smooth">
                    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 pb-20">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <span className="font-mono font-bold">[SYSTEM_ERROR]</span>
                                <span className="text-sm">{error}</span>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="ml-auto text-xs underline hover:text-red-400"
                                >
                                    RETRY_CONNECTION()
                                </button>
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>

        </div>
    );
};
