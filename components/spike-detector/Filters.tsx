import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

export interface FilterState {
    network: string;
    minLiquidity: number;
    minVolume5m: number;
    maxAgeHours: number;
    autoRefresh: boolean;
}

interface FiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    onRefresh: () => void;
    isRefreshing: boolean;
}

export function FilterPanel({ filters, setFilters, onRefresh, isRefreshing }: FiltersProps) {

    const handleNetworkChange = (val: string) => {
        setFilters({ ...filters, network: val });
    };

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

                {/* Network Selector */}
                <div className="space-y-2">
                    <Label>Network</Label>
                    <Select value={filters.network} onValueChange={handleNetworkChange}>
                        <SelectTrigger className="w-[180px] border-slate-700 bg-slate-800">
                            <SelectValue placeholder="All Networks" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Networks</SelectItem>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="solana">Solana</SelectItem>
                            <SelectItem value="bsc">BNB Chain</SelectItem>
                            <SelectItem value="base">Base</SelectItem>
                            <SelectItem value="arbitrum">Arbitrum</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Filters */}
                <div className="flex-1 space-y-6 px-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Label>Min Liquidity</Label>
                            <span className="text-slate-400">${filters.minLiquidity.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[filters.minLiquidity]}
                            max={500000}
                            step={1000}
                            className="cursor-pointer"
                            onValueChange={(vals) => setFilters({ ...filters, minLiquidity: vals[0] })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Label>Min 5m Volume</Label>
                            <span className="text-slate-400">${filters.minVolume5m.toLocaleString()}</span>
                        </div>
                        <Slider
                            value={[filters.minVolume5m]}
                            max={50000}
                            step={100}
                            className="cursor-pointer"
                            onValueChange={(vals) => setFilters({ ...filters, minVolume5m: vals[0] })}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <Label>Max Pair Age</Label>
                            <span className="text-slate-400">{filters.maxAgeHours}h</span>
                        </div>
                        <Slider
                            value={[filters.maxAgeHours]}
                            min={1}
                            max={7200}
                            step={24}
                            className="cursor-pointer"
                            onValueChange={(vals) => setFilters({ ...filters, maxAgeHours: vals[0] })}
                        />
                        <p className="text-[10px] text-slate-500 text-right">Up to 300 days</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="auto-refresh"
                            checked={filters.autoRefresh}
                            onCheckedChange={(c) => setFilters({ ...filters, autoRefresh: c })}
                        />
                        <Label htmlFor="auto-refresh">Auto-refresh (30s)</Label>
                    </div>

                    <Button
                        onClick={onRefresh}
                        className={`w-full bg-brand-primary text-white hover:bg-brand-primary/90 ${isRefreshing ? 'opacity-80' : ''}`}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? "Scanning..." : "Scan Now"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
