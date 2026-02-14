
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface TooltipHelperProps {
    content: string;
    className?: string;
}

export function TooltipHelper({ content, className = "w-4 h-4" }: TooltipHelperProps) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Info className={`text-muted-foreground hover:text-white cursor-help transition-colors ${className}`} />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-brand-dark/95 border-brand-purple/20 text-gray-200">
                    <p>{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
