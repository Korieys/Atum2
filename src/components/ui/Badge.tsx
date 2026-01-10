import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    color?: string; // We can use this for dynamic colors, or use variants
    className?: string;
    variant?: 'primary' | 'accent' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'primary' }) => {
    // Mapping variants to our specific colors for now, or just using classes.
    // In the scaffold, it used dynamic hex values.
    // We can replicate that or simplify to classes if we stick to the theme.

    const variantStyles = {
        primary: 'bg-primary/10 text-primary',
        accent: 'bg-accent/10 text-accent',
        default: 'bg-white/10 text-textMuted',
    };

    return (
        <span
            className={cn(
                "text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded",
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
};
