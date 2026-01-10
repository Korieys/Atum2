import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Github, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';

export const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            navigate('/app');
        }
    }, [session, navigate]);


    const handleGithubLogin = async () => {
        setIsLoading(true);
        setMessage(''); // Clear previous messages
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            setIsLoading(false);
            setMessage(error.message);
            console.error(error);
        }
    };

    // Fallback for email login (magic link) if GitHub isn't configured
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin
            }
        });
        setIsLoading(false);
        if (error) {
            setMessage('Error sending magic link');
            console.error(error);
        } else {
            setMessage('Check your email for the magic link!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse duration-3000"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl opacity-50 mix-blend-screen animate-pulse duration-5000 delay-1000"></div>
            </div>

            <div className="w-full max-w-md p-8 rounded-2xl border border-border bg-surface/50 backdrop-blur-xl relative z-10 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/20">
                        <div className="w-6 h-6 bg-black rounded-lg transform rotate-45"></div>
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">Welcome to Atum</h1>
                    <p className="text-textMuted">Your personal engine for building in public.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGithubLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white p-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Github size={20} />}
                        <span>Continue with GitHub</span>
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface px-2 text-textMuted">Or continue with email</span></div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-3">
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-border rounded-xl p-3 text-white placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 p-3 rounded-xl font-bold transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send Magic Link'}
                        </button>
                        {message && <p className={`text-xs text-center mt-2 ${message.includes('Check') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-textMuted">
                    By clicking continue, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a>.
                </p>
            </div>
        </div>
    );
};
