import { useState } from 'react';
import { Zap, Twitter, Linkedin, Image as ImageIcon, Youtube, MessageSquare } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { cn } from '../lib/utils';
import { useAtumStore } from '../store/useAtumStore';

export const Narrative = () => {
    const { addDraft, activityLog } = useAtumStore();
    const [activeTab, setActiveTab] = useState('editor');
    const [source, setSource] = useState('Recent Commits');
    const [customContext, setCustomContext] = useState('');
    const [vibe, setVibe] = useState('Technical');
    const [platform, setPlatform] = useState('Twitter');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGeneratedContent('');

        try {
            // 1. Gather Context
            let contextData = "";
            if (source === 'Recent Commits') {
                const recentCommits = activityLog
                    .filter(a => a.type === 'commit')
                    .slice(0, 10)
                    .map(c => `- ${c.title} (${c.desc})`)
                    .join('\n');

                const commitData = recentCommits || "No recent commits found.";

                if (customContext) {
                    contextData = `User Guidance: ${customContext}\n\nRecent Technical Activity:\n${commitData}`;
                } else {
                    contextData = commitData;
                }
            } else if (source === 'Custom Topic') {
                contextData = customContext || "No topic provided. Write a generic update about building cool tech.";
            } else {
                contextData = "General project update about progress.";
            }

            // 2. Construct Prompt based on Platform
            let prompt = "";
            const basePrompt = `Context:\n${contextData}\n\nTone: ${vibe}\n`;

            switch (platform) {
                case 'YouTube':
                    prompt = `${basePrompt}
                    Task: Write a structured script outline for a YouTube video devlog.
                    Structure: 
                    1. Hook (0:00-0:30)
                    2. The Problem (What we tackled)
                    3. The Solution (Technical deep dive on the commits)
                    4. Results & CTA.
                    output format: Markdown.`;
                    break;
                case 'Reddit':
                    prompt = `${basePrompt}
                    Task: Write a text-post for r/webdev or r/SaaS.
                    Structure: Catchy but honest title. value-driven body explaining what was learned or built. Avoid self-promotion language. Focus on technical wins.`;
                    break;
                case 'LinkedIn':
                    prompt = `${basePrompt}
                    Task: Write a professional LinkedIn update.
                    Structure: Hook line, bullet points of achievements, "What I learned", and a generic engaging question at the end.`;
                    break;
                case 'Twitter':
                default:
                    prompt = `${basePrompt}
                    Task: Write a threaded tweet series (3-5 tweets).
                    Style: Punchy, short sentences. Use emojis sparingly. Focus on "Building in public" narrative.`;
                    break;
            }

            const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

            if (!apiKey) {
                // Mock response if no API key for testing
                // alert("Missing API Key..."); 
                setGeneratedContent(`// SIMULATED OUTPUT FOR ${platform.toUpperCase()}\n\n[PROMPT SENDS]:\n${prompt}\n\n// Add API Key to .env to get real AI generation.`);
                setIsGenerating(false);
                return;
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            setGeneratedContent(data.choices[0].message.content);
        } catch (error) {
            console.error("Values:", error);
            alert("Failed to generate content. See console for details.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!generatedContent) return;
        await addDraft({
            title: `Draft: ${vibe} - ${new Date().toLocaleDateString()}`,
            type: 'Social Post',
            status: 'Draft',
            platform: platform,
            content: generatedContent
        });
        alert('Draft saved to Fabricator!');
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">

            {/* Configuration Panel */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                <div className="p-5 rounded-xl border border-border bg-surface space-y-6">
                    <div>
                        <label className="text-xs font-bold uppercase text-textMuted mb-3 block">Source Material</label>
                        <div className="space-y-2">
                            {['Recent Commits', 'Custom Topic', 'Completed Tasks'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSource(s)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded text-sm transition-all border",
                                        source === s ? "bg-primary/10 border-primary text-primary" : "bg-transparent border-border text-textMuted hover:border-primary/30"
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-textMuted mb-3 block">
                            {source === 'Custom Topic' ? 'Topic Description' : 'Additional Context'}
                        </label>
                        <textarea
                            value={customContext}
                            onChange={(e) => setCustomContext(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg p-3 text-sm text-textMain focus:border-primary focus:outline-none transition-colors h-24 resize-none"
                            placeholder={source === 'Custom Topic' ? "What do you want to post about?" : "Describe the changes or add focus..."}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-textMuted mb-3 block">Vibe Check</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Hype', 'Technical', 'Vulnerable', 'Educational'].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setVibe(v)}
                                    className={cn(
                                        "px-2 py-2 rounded text-xs font-bold border transition-all",
                                        vibe === v ? "bg-accent/10 border-accent text-accent" : "bg-transparent border-border text-textMuted hover:border-accent/30"
                                    )}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-textMuted mb-3 block">Platform</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPlatform('Twitter')}
                                className={cn("p-2 rounded border transition-colors", platform === 'Twitter' ? "border-primary text-primary bg-primary/10" : "border-border text-textMuted")}
                            >
                                <Twitter size={16} />
                            </button>
                            <button
                                onClick={() => setPlatform('LinkedIn')}
                                className={cn("p-2 rounded border transition-colors", platform === 'LinkedIn' ? "border-blue-500 text-blue-500 bg-blue-500/10" : "border-border text-textMuted")}
                            >
                                <Linkedin size={16} />
                            </button>
                            <button
                                onClick={() => setPlatform('Reddit')}
                                className={cn("p-2 rounded border transition-colors", platform === 'Reddit' ? "border-orange-500 text-orange-500 bg-orange-500/10" : "border-border text-textMuted")}
                            >
                                <MessageSquare size={16} />
                            </button>
                            <button
                                onClick={() => setPlatform('YouTube')}
                                className={cn("p-2 rounded border transition-colors", platform === 'YouTube' ? "border-red-500 text-red-500 bg-red-500/10" : "border-border text-textMuted")}
                            >
                                <Youtube size={16} />
                            </button>
                        </div>
                    </div>

                    <ActionButton onClick={handleGenerate} primary className="w-full justify-center">
                        {isGenerating ? <Zap className="animate-pulse" size={16} /> : <Zap size={16} />}
                        {isGenerating ? 'Fabricating...' : 'Generate Update'}
                    </ActionButton>
                </div>
            </div>

            {/* Editor / Preview */}
            <div className="flex-1 rounded-xl border border-border bg-surface overflow-hidden flex flex-col">
                <div className="border-b border-border flex">
                    <button
                        onClick={() => setActiveTab('editor')}
                        className={cn("px-6 py-3 text-sm font-bold border-r border-border transition-colors", activeTab === 'editor' ? "bg-surfaceHighlight text-textMain" : "text-textMuted hover:text-textMain")}
                    >
                        Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={cn("px-6 py-3 text-sm font-bold border-r border-border transition-colors", activeTab === 'preview' ? "bg-surfaceHighlight text-textMain" : "text-textMuted hover:text-textMain")}
                    >
                        Preview
                    </button>
                </div>

                <div className="flex-1 p-6 relative">
                    {activeTab === 'editor' ? (
                        <textarea
                            className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed text-textMain"
                            placeholder="// Generated narrative will appear here..."
                            value={generatedContent}
                            onChange={(e) => setGeneratedContent(e.target.value)}
                        ></textarea>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg border border-dashed border-border">
                            <div className="text-center opacity-50">
                                <ImageIcon className="mx-auto mb-2" />
                                <span className="text-xs">Preview visual will be generated here</span>
                            </div>
                        </div>
                    )}

                    {generatedContent && (
                        <div className="absolute bottom-6 right-6 flex gap-2">
                            <ActionButton onClick={handleSaveDraft} className="bg-surface border-border hover:bg-surfaceHighlight text-textMain">Save Draft</ActionButton>
                            <ActionButton primary>Post Now</ActionButton>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};
