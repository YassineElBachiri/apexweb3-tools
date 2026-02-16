import { Deal } from "@/lib/deals-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Copy, ExternalLink, Star, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

interface DealCardProps {
    deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
    const [copied, setCopied] = useState(false);
    const [imgSrc, setImgSrc] = useState(deal.logo);

    const copyCode = () => {
        if (deal.code) {
            navigator.clipboard.writeText(deal.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card className={`relative h-full overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-colors hover:border-brand-primary/50 ${deal.featured ? 'ring-1 ring-brand-primary/30' : ''}`}>

                {deal.editorsPick && (
                    <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-yellow-600 to-yellow-500 px-12 py-1 text-xs font-bold text-white shadow-lg">
                        Editor&apos;s Pick
                    </div>
                )}

                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 p-2">
                        <Image
                            src={imgSrc}
                            alt={`${deal.name} logo`}
                            fill
                            className="object-contain p-2"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(deal.name)}&background=random&color=fff&size=128`)}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-white">{deal.name}</h3>
                            {deal.featured && <Star className="h-4 w-4 fill-brand-primary text-brand-primary" />}
                        </div>
                        <Badge variant="secondary" className="mt-1 border-slate-700 bg-slate-800 text-slate-300">
                            {deal.category}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="min-h-[3rem] text-sm text-slate-400">{deal.summary}</p>

                    <div className="rounded-lg border border-brand-primary/20 bg-brand-primary/5 p-3">
                        <p className="text-center font-bold text-brand-primary">{deal.offer}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key Benefits</p>
                        <ul className="space-y-1">
                            {deal.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start text-sm text-slate-300">
                                    <Check className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-2">
                        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400">
                            Best For: {deal.bestFor}
                        </Badge>
                    </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                    {deal.code ? (
                        <Button variant="outline" className="flex-1 border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white" onClick={copyCode}>
                            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                            {copied ? "Copied" : deal.code}
                        </Button>
                    ) : null}

                    <Button className={`flex-1 ${!deal.code ? 'w-full' : ''} bg-white text-slate-900 hover:bg-slate-200`} asChild>
                        <a href={deal.link} target="_blank" rel="noopener noreferrer nofollow">
                            Claim Deal <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
