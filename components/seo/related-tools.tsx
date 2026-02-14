import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatedTool {
    name: string;
    description: string;
    href: string;
    icon?: string;
}

interface RelatedToolsProps {
    tools: RelatedTool[];
    title?: string;
    className?: string;
}

export function RelatedTools({ tools, title = "Related Tools", className = "" }: RelatedToolsProps) {
    return (
        <section className={`space-y-6 ${className}`}>
            <h2 className="text-2xl md:text-3xl font-bold">
                {title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool, index) => (
                    <Link key={index} href={tool.href}>
                        <Card className="group h-full border-primary/20 bg-gradient-to-br from-background to-background/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <span>{tool.name}</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {tool.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
