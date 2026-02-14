"use client";

import { Button } from "@/components/ui/button";
import { Share2, Copy, Twitter, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TokenShareProps {
    symbol: string;
    score: number;
    riskLevel: string;
    address: string;
}

export function TokenShare({ symbol, score, riskLevel, address }: TokenShareProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out the tokenomics analysis for $${symbol} on ApexWeb3!\n\nInvestment Score: ${score}/100\nRisk Level: ${riskLevel.toUpperCase()}\n\nAnalyze here: ${shareUrl}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTwitterShare = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    };

    const handleTelegramShare = () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Result
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background border-border">
                <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy Link"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTwitterShare} className="cursor-pointer">
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on X
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTelegramShare} className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Share on Telegram
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
