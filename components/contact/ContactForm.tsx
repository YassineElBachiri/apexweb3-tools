"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export function ContactForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });

        // Reset success state after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
    };

    if (status === "success") {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500 bg-white/3 border border-brand-purple/20 rounded-3xl p-12">
                <div className="p-4 rounded-full bg-brand-purple/20 border border-brand-purple/30">
                    <CheckCircle2 className="w-12 h-12 text-brand-purple" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                <p className="text-gray-400 max-w-xs">
                    Thank you for reaching out. We&apos;ll get back to you within 24-48 hours.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-sm font-medium text-brand-purple hover:underline"
                >
                    Send another message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Subject</label>
                <input
                    id="subject"
                    type="text"
                    required
                    placeholder="Sponsorship inquiry / Guest post..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Message</label>
                <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us what you have in mind..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-purple text-white font-bold hover:bg-brand-purple/90 transition-all disabled:opacity-50 group"
            >
                {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        Send Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}
