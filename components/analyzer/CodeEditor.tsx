"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Check, Download } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeEditorProps {
    code: string;
    language: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function CodeEditor({ code, language, onChange, placeholder }: CodeEditorProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        if (confirm("Are you sure you want to clear the code?")) {
            onChange("");
        }
    };

    return (
        <div className="relative flex flex-col h-full overflow-hidden rounded-md border border-white/10 bg-[#1e1e1e]">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/20 border-b border-white/5">
                <div className="text-xs text-muted-foreground font-mono uppercase">
                    {language === 'solidity' ? 'Solidity' : language === 'rust' ? 'Rust' : 'Move'}
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-white"
                        onClick={handleCopy}
                        title="Copy Code"
                    >
                        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-400"
                        onClick={handleClear}
                        title="Clear Code"
                        disabled={!code}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="relative flex-1 min-h-[500px]">
                <Textarea
                    value={code}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                    className="absolute inset-0 w-full h-full font-mono text-sm resize-none bg-transparent text-transparent caret-white text-base p-6 z-10 focus:outline-none border-none leading-relaxed"
                    spellCheck={false}
                    placeholder={placeholder}
                />
                <div className="absolute inset-0 w-full h-full pointer-events-none p-6 overflow-hidden">
                    <SyntaxHighlighter
                        language={language === 'move' ? 'rust' : language}
                        style={vscDarkPlus}
                        customStyle={{ margin: 0, padding: 0, background: 'transparent', lineHeight: '1.625rem', fontSize: '1rem' }}
                        wrapLines={true}
                        wrapLongLines={true}
                    >
                        {code || " "}
                    </SyntaxHighlighter>
                </div>
            </div>
        </div>
    );
}
