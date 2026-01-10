import React from 'react';
import { cn } from '../../lib/utils';

interface TechCardProps {
    title: string;
    value: string;
    subtext: string;
    trend: string;
    className?: string;
}

export const TechCard: React.FC<TechCardProps> = ({ title, value, subtext, trend, className }) => {
    return (
        <div className={cn(
            "relative group overflow-hidden rounded-xl border border-border p-5 transition-all",
            "bg-gradient-to-br from-surface to-surfaceHighlight",
            className
        )}>
            {/* Tech Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(0deg, transparent 24%, #d2ff28 25%, #d2ff28 26%, transparent 27%, transparent 74%, #d2ff28 75%, #d2ff28 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #d2ff28 25%, #d2ff28 26%, transparent 27%, transparent 74%, #d2ff28 75%, #d2ff28 76%, transparent 77%, transparent)`,
                    backgroundSize: '30px 30px'
                }}
            />

            <div className="relative z-10 flex justify-between items-start mb-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-textMuted">{title}</h3>
                <div className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    {trend}
                </div>
            </div>

            <div className="relative z-10 flex items-end gap-3">
                <span className="text-3xl font-bold text-textMain">{value}</span>
                <span className="text-xs mb-1.5 text-textMuted">{subtext}</span>
            </div>

            {/* Mock Sparkline */}
            <div className="mt-4 h-8 flex items-end gap-1 opacity-50">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}
                        className={cn(
                            "w-full rounded-t-sm transition-all",
                            i > 8 ? "bg-primary" : "bg-border"
                        )}
                        style={{
                            height: `${30 + Math.random() * 70}%`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
