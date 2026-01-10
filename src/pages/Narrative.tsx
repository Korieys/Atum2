import { useState } from 'react';
import { Zap, Twitter, Linkedin, Image as ImageIcon } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { cn } from '../lib/utils';
import { useAtumStore } from '../store/useAtumStore';

export const Narrative = () => {
    const { addDraft } = useAtumStore();
    const [activeTab, setActiveTab] = useState('editor');
    const [source, setSource] = useState('Recent Commits');
    const [vibe, setVibe] = useState('Technical');
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            setGeneratedContent(`🚀 Just shipped a major update to the core engine!\n\nOptimized the rendering pipeline by 40% using a new virtual DOM strategy. This was a tricky refactor but totally worth it for the performance gains.\n\n#BuildInPublic #React #Performance`);
            setIsGenerating(false);
        }, 1500);
    };

    const handleSaveDraft = () => {
        if (!generatedContent) return;
        addDraft({
            title: `Update: ${vibe} - ${new Date().toLocaleDateString()}`,
            type: 'Social Post',
            status: 'Draft',
            platform: 'Twitter'
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
                            {['Recent Commits', 'Completed Tasks', 'Meeting Notes'].map(s => (
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
                        <label className="text-xs font-bold uppercase text-textMuted mb-3 block">Format</label>
                        <div className="flex gap-2">
                            <button className="p-2 rounded border border-primary/50 text-primary bg-primary/10"><Twitter size={16} /></button>
                            <button className="p-2 rounded border border-border text-textMuted hover:text-textMain"><Linkedin size={16} /></button>
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
