import { useAtumStore } from '../store/useAtumStore';
import { Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';

export const DailyInsight = () => {
    const { activityLog, drafts } = useAtumStore();

    // Logic to derive insight
    const getInsight = () => {
        if (activityLog.length === 0) {
            return {
                title: "Systems Idle",
                message: "Initialize your first activity or draft to generate insights.",
                action: "Start Building"
            };
        }

        // Analyze recent activity
        const recentLogs = activityLog.slice(0, 10);
        const typeCounts = recentLogs.reduce((acc, curr) => {
            acc[curr.type] = (acc[curr.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

        // Analyze drafts
        const pendingDrafts = drafts.filter(d => d.status === 'Draft' || d.status === 'Scripted');
        const nextDraft = pendingDrafts[0];

        if (pendingDrafts.length > 3) {
            return {
                title: "Backlog Growing",
                message: `You have ${pendingDrafts.length} pending drafts. Focus on finishing "${nextDraft?.title || 'one'}" today.`,
                action: "View Drafts"
            };
        }

        if (topType === 'commit') {
            return {
                title: "Code Flow",
                message: "High coding velocity detected. Consider documenting your progress in a new draft.",
                action: "Create Log"
            };
        }

        if (topType === 'milestone') {
            return {
                title: "Momentum Spike",
                message: "You're hitting milestones. Good time to share an update with your tribe.",
                action: "Share Update"
            };
        }

        return {
            title: "Steady Progress",
            message: `You've logged ${activityLog.length} activities. Consistency is key. Keep building.`,
            action: "Track Activity"
        };
    };

    const insight = getInsight();

    return (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-surface to-surfaceHighlight p-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lightbulb size={64} />
            </div>

            <div className="bg-background/40 backdrop-blur-sm p-4 rounded-lg h-full flex flex-col relative z-10 hover:bg-background/30 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-primary" />
                    <span className="text-xs font-mono font-bold uppercase text-primary tracking-wider">Daily Insight</span>
                </div>

                <h3 className="text-lg font-bold text-textMain mb-1">{insight.title}</h3>
                <p className="text-sm text-textMuted mb-4 flex-1">{insight.message}</p>

                <div className="flex items-center gap-1 text-xs font-bold text-primary cursor-pointer hover:underline">
                    {insight.action} <ArrowRight size={12} />
                </div>
            </div>
        </div>
    );
};
