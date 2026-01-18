import React from 'react';
import { cn } from '../../lib/utils';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    shadow?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    children,
    primary = false,
    className,
    shadow, // Destructure to avoid passing to DOM
    ...props
}) => {
    return (
        <button
            className={cn(
                "px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-sm justify-center",
                primary
                    ? "bg-primary text-black hover:brightness-110 hover:scale-105 shadow-[0_0_15px_-3px_rgba(210,255,40,0.5)]"
                    : "bg-transparent text-textMain border border-border hover:bg-white/5",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
