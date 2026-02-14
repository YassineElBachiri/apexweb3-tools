"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { type JobFilter } from "@/types/job";
import { useRouter, useSearchParams } from "next/navigation";

interface JobFiltersProps {
    initialFilters?: Partial<JobFilter>;
    onFilterChange: (filters: Partial<JobFilter>) => void;
    availableTags?: string[];
    maxPrice?: number; // Example prop
}

const COMMON_TAGS = ["React", "Solidity", "Rust", "DeFi", "Smart Contract", "Frontend", "Backend", "Design", "Marketing"];


export function JobFilters({ onFilterChange, initialFilters }: JobFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [remoteOnly, setRemoteOnly] = useState(initialFilters?.remoteOnly || searchParams.get("remote") === "true");
    const [searchTerm, setSearchTerm] = useState(initialFilters?.tag || searchParams.get("q") || "");
    const [selectedTag, setSelectedTag] = useState(initialFilters?.tag || searchParams.get("tag") || "all");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        onFilterChange({ tag: e.target.value }); // Naive search mapping for now, or separate search
    };

    const handleRemoteChange = (checked: boolean) => {
        setRemoteOnly(checked);
        onFilterChange({ remoteOnly: checked });
    };

    const handleTagChange = (value: string) => {
        setSelectedTag(value);
        onFilterChange({ tag: value === "all" ? "" : value });
    };

    return (
        <div className="relative mb-10 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">

                    {/* Search Input */}
                    <div className="relative w-full lg:flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search by role, company, or keywords..."
                            className="pl-12 h-12 text-base bg-background/50 border-white/10 focus:border-primary/50 focus:bg-background/80 transition-all rounded-xl shadow-inner"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">

                        {/* Remote Toggle */}
                        <div className="flex items-center gap-3 bg-background/50 px-4 py-2.5 rounded-xl border border-white/10 hover:border-primary/30 transition-colors shadow-sm cursor-pointer" onClick={() => handleRemoteChange(!remoteOnly)}>
                            <Switch
                                id="remote-mode"
                                checked={remoteOnly}
                                onCheckedChange={handleRemoteChange}
                                className="data-[state=checked]:bg-primary"
                            />
                            <Label htmlFor="remote-mode" className="text-sm font-medium cursor-pointer select-none">
                                Remote Only 🌍
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Popular Tags / Quick Filters */}
                <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Popular:</span>
                    <Button
                        variant={selectedTag === "all" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleTagChange("all")}
                        className="rounded-full text-xs h-8 px-4"
                    >
                        All
                    </Button>
                    {COMMON_TAGS.slice(0, 6).map(tag => (
                        <Button
                            key={tag}
                            variant={selectedTag === tag ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTagChange(tag === selectedTag ? "all" : tag)}
                            className={`rounded-full text-xs h-8 px-4 border-white/10 ${selectedTag === tag ? 'shadow-md shadow-primary/20' : 'bg-background/30 hover:bg-background/60 text-muted-foreground'}`}
                        >
                            {tag}
                        </Button>
                    ))}
                    <div className="ml-auto">
                        <Select value={selectedTag} onValueChange={handleTagChange}>
                            <SelectTrigger className="w-[140px] h-8 text-xs bg-transparent border-transparent hover:bg-white/5 data-[state=open]:bg-white/5 rounded-lg focus:ring-0">
                                <SelectValue placeholder="More Tags" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tags</SelectItem>
                                {COMMON_TAGS.map(tag => (
                                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
