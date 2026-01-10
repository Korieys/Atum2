import { useState, useEffect, useRef } from 'react';
import { auth } from '../lib/firebase';
import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { Github, Loader2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider';

export const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    // Email Auth State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { user } = useAuth();
    const isLoggingIn = useRef(false);

    useEffect(() => {
        if (user && !isLoggingIn.current) {
            navigate('/app');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        console.log("Starting Google Login...");
        setIsLoading(true);
        setMessage('');
        isLoggingIn.current = true;
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/app');
        } catch (error: any) {
            setMessage(error.message);
            setIsLoading(false);
            isLoggingIn.current = false;
        }
    };

    const handleGithubLogin = async () => {
        setIsLoading(true);
        setMessage('');
        isLoggingIn.current = true;
        const provider = new GithubAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/app');
        } catch (error: any) {
            setMessage(error.message);
            setIsLoading(false);
            isLoggingIn.current = false;
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        isLoggingIn.current = true;

        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                navigate('/app/onboarding');
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/app');
            }
        } catch (error: any) {
            console.error("Auth Error:", error);
            let msg = error.message.replace('Firebase: ', '');
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                msg = "Invalid email or password.";
            } else if (error.code === 'auth/email-already-in-use') {
                msg = "Account already exists. Try signing in.";
            } else if (error.code === 'auth/weak-password') {
                msg = "Password should be at least 6 characters.";
            }
            setMessage(msg);
            setIsLoading(false);
            isLoggingIn.current = false;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
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
                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black p-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin text-black" size={20} /> : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        <span>Continue with Google</span>
                    </button>

                    {/* GitHub Login */}
                    <button
                        onClick={handleGithubLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white p-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Github size={20} />}
                        <span>Continue with GitHub</span>
                    </button>

                    <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface px-2 text-textMuted">Or continue with email</span></div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div className="space-y-3">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full bg-black/20 border border-border rounded-xl p-3 text-white placeholder:text-textMuted focus:outline-none focus:border-primary/50 text-sm"
                            />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-black/20 border border-border rounded-xl p-3 text-white placeholder:text-textMuted focus:outline-none focus:border-primary/50 text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primaryHighlight text-black p-3 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Mail size={18} />}
                            {isSignUp ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-xs text-textMuted hover:text-primary transition-colors hover:underline"
                        >
                            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                        </button>
                    </div>

                    {message && <p className="text-red-400 text-xs text-center mt-2 bg-red-500/10 p-2 rounded">{message}</p>}
                </div>
            </div>
        </div>
    );
};
