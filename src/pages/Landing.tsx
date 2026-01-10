import { ActionButton } from '../components/ui/ActionButton';
import { ArrowRight, CheckCircle2, Zap, Shield, Globe, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-textMain font-sans selection:bg-primary/30 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-black font-mono">A</div>
                        <span className="font-bold text-lg tracking-tight">Atum</span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/login')} className="text-sm font-bold text-textMuted hover:text-white transition-colors">Log In</button>
                        <ActionButton onClick={() => navigate('/login')} primary className="py-1.5 px-4 text-xs">Get Started</ActionButton>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 opacity-50 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        v1.0 is Live
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                        Build in public, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">without the noise.</span>
                    </h1>

                    <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
                        The all-in-one operating system for indie hackers and creators. Track progress, capture ideas, and generate content updates automatically.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <ActionButton onClick={() => navigate('/login')} primary className="h-12 px-8 text-base w-full sm:w-auto justify-center">
                            Start Building Free <ArrowRight className="ml-2" />
                        </ActionButton>
                        <button className="h-12 px-8 rounded-lg border border-border hover:bg-white/5 font-bold transition-all w-full sm:w-auto">
                            View Demo
                        </button>
                    </div>

                    <div className="pt-12 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Mock logos or trust indicators */}
                        <div className="flex items-center gap-2 font-mono text-xs"><Terminal size={14} /> INDIE_STACK</div>
                        <div className="flex items-center gap-2 font-mono text-xs"><Globe size={14} /> OPEN_BUILD</div>
                        <div className="flex items-center gap-2 font-mono text-xs"><Zap size={14} /> SHIP_FAST</div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 px-6 border-t border-white/5 bg-secondary/20">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <CheckCircle2 className="text-primary" />, title: "Smart Tracking", desc: "Log tasks, commits, and milestones in a unified timeline." },
                            { icon: <Zap className="text-accent" />, title: "Narrative Engine", desc: "Turn raw activity logs into engaging social media updates instantly." },
                            { icon: <Shield className="text-purple-400" />, title: "Private by Default", desc: "Your data is yours. Secure, encrypted, and local-first philosophy." },
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-surface border border-white/5 hover:border-primary/20 transition-all group">
                                <div className="mb-6 p-3 bg-black/50 w-fit rounded-lg group-hover:scale-110 transition-transform">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <p className="text-textMuted leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center text-textMuted text-sm">
                <p>© {new Date().getFullYear()} Project Atum. Built with ❤️ by Korieys.</p>
            </footer>
        </div>
    );
};
