import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'secondary' | 'outline' | 'primary' | 'accent';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default' }) => {
    const variants = {
        default: "bg-surfaceHighlight text-textMain border-border",
        success: "bg-green-500/10 text-green-500 border-green-500/20",
        secondary: "bg-surface text-textMuted border-transparent",
        outline: "bg-transparent text-textMuted border-border",
        primary: "bg-primary/10 text-primary border-primary/20",
        accent: "bg-accent/10 text-accent border-accent/20"
    };

    return (
        <span className={cn(
            "px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider",
            variants[variant] || variants.default,
            className
        )}>
            {children}
        </span>
    );
};
