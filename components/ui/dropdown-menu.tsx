"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
    children: React.ReactNode;
}

const DropdownMenuContext = React.createContext<{
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
    const [open, setOpen] = React.useState(false);
    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block text-left relative-dropdown-container">
                {children}
            </div>
        </DropdownMenuContext.Provider>
    );
};

export const DropdownMenuTrigger = React.forwardRef<
    HTMLButtonElement,
    { children: React.ReactNode; asChild?: boolean; className?: string }
>(({ children, asChild, className, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

    return (
        <div
            onClick={() => context.setOpen(!context.open)}
            className={cn("cursor-pointer", className)}
        >
            {children}
        </div>
    );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export const DropdownMenuContent = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; align?: "start" | "end" | "center"; className?: string }
>(({ children, align = "center", className, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");


    // Simple click outside handler
    React.useEffect(() => {
        if (!context.open) return; // Optimization: don't attach listener if closed? No, effects run on mount/update. 
        // Actually, better to attach/detach based on open state in dependency array
        // But for this fix, just moving usage up is enough.

        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as Element).closest(".relative-dropdown-container")) {
                context.setOpen(false);
            }
        };

        if (context.open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [context, context.open]);

    if (!context.open) return null;

    const alignmentClasses = {
        start: "left-0",
        end: "right-0",
        center: "left-1/2 -translate-x-1/2",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 mt-2",
                alignmentClasses[align],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; className?: string; onClick?: () => void }
>(({ children, className, onClick, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext);

    const handleClick = () => {
        if (onClick) onClick();
        context?.setOpen(false);
    };

    return (
        <div
            ref={ref}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            {children}
        </div>
    );
});
DropdownMenuItem.displayName = "DropdownMenuItem";
