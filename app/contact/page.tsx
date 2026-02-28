import { Metadata } from "next";
import { Mail, Instagram, Twitter, Linkedin, MessageSquare, ExternalLink, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
    title: "Contact Us | ApexWeb3",
    description: "Get in touch with ApexWeb3 for sponsorship opportunities, guest posts, or general inquiries.",
};

const socials = [
    {
        name: "X (Twitter)",
        handle: "@apexweb3_",
        icon: Twitter,
        href: "https://x.com/apexweb3_",
        color: "text-white",
        bg: "bg-white/5",
    },
    {
        name: "LinkedIn",
        handle: "ApexWeb3",
        icon: Linkedin,
        href: "https://www.linkedin.com/company/apexweb3/",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    {
        name: "Instagram",
        handle: "@apexweb3_",
        icon: Instagram,
        href: "https://www.instagram.com/apexweb3_/",
        color: "text-pink-400",
        bg: "bg-pink-400/10",
    },
    {
        name: "Medium",
        handle: "ApexWeb3",
        icon: MessageSquare,
        href: "https://apexweb3.medium.com/",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
    },
];

const faqs = [
    {
        q: "How can I contact ApexWeb3?",
        a: "You can reach us via our social media channels or by sending a direct inquiry for sponsorships and collaborations."
    },
    {
        q: "What topics does ApexWeb3 cover?",
        a: "We cover a wide range of topics related to blockchain, Web3, AI, DeFi, NFTs, Metaverse, and crypto news."
    },
    {
        q: "Can I submit a guest post?",
        a: "Yes! We welcome high-quality guest contributions related to Web3, blockchain, AI, and crypto. Contact us with your topic idea first."
    }
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-white">
            <div className="container mx-auto px-4 pt-32 pb-24">

                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-bold uppercase tracking-widest mb-6 border border-brand-purple/20">
                        Connect with ApexWeb3
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Have a question, a proposal, or just want to chat about the future of Web3?
                        Our inbox is always open.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto mb-32">

                    {/* Left Side: Info & Socials */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-brand-purple" />
                                Why contact us?
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    "Sponsorship opportunities for Web3 projects",
                                    "Guest post contributions and collaborations",
                                    "Tool feedback and feature requests",
                                    "General inquiries about blockchain and AI"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-2 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold font-display">Social Channels</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {socials.map((social) => (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        className={`p-6 rounded-2xl ${social.bg} border border-white/5 hover:border-white/10 transition-all group`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <social.icon className={`w-8 h-8 ${social.color}`} />
                                            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                                        </div>
                                        <div className="font-bold text-lg">{social.name}</div>
                                        <div className="text-sm text-gray-500">{social.handle}</div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Form */}
                    <div className="bg-white/3 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                            <p className="text-gray-400">Fill out the form below and we&apos;ll get back to you shortly.</p>
                        </div>
                        <ContactForm />
                    </div>

                    {/* FAQ */}
                    <div className="max-w-4xl mx-auto bg-white/3 border border-white/10 rounded-3xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest text-gray-400">Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="space-y-3">
                                    <h3 className="font-bold text-white text-lg">{faq.q}</h3>
                                    <p className="text-gray-500 leading-relaxed text-sm">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
