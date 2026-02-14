
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface AdvancedToggleProps {
    isAdvanced: boolean;
    onToggle: (checked: boolean) => void;
}

export function AdvancedToggle({ isAdvanced, onToggle }: AdvancedToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-brand-dark/50 p-2 rounded-lg border border-white/5">
            <Switch
                id="advanced-mode"
                checked={isAdvanced}
                onCheckedChange={onToggle}
                className="data-[state=checked]:bg-brand-purple"
            />
            <Label htmlFor="advanced-mode" className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-300">
                Advanced Mode
                {isAdvanced && <Sparkles className="w-3 h-3 text-brand-purple animate-pulse" />}
            </Label>
        </div>
    );
}
