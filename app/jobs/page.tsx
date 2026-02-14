import { fetchWeb3Jobs } from "@/lib/web3Career";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { SeoContent } from "@/components/jobs/SeoContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Web3 Jobs – Remote Crypto & Blockchain Careers",
    description: "Find the best Web3, Crypto, and Blockchain jobs. Remote, Engineering, Marketing, and more.",
    alternates: {
        canonical: "https://apexweb3.com/jobs",
    },
    openGraph: {
        title: "Web3 Jobs – Remote Crypto & Blockchain Careers",
        description: "Find the best Web3, Crypto, and Blockchain jobs. Remote, Engineering, Marketing, and more.",
        url: "https://apexweb3.com/jobs",
        siteName: "ApexWeb3 Tools",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Web3 Jobs – Remote Crypto & Blockchain Careers",
        description: "Find the best Web3, Crypto, and Blockchain jobs.",
    },
};

export default async function JobsPage() {
    const { jobs, error } = await fetchWeb3Jobs();

    // Generate JSON-LD for Job Postings
    const jsonLd = jobs.map((job) => ({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description || `Job opportunity at ${job.company}`,
        "datePosted": job.created_at,
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.company,
            "logo": job.logo,
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
            },
        },
        "employmentType": job.remote ? "TELECOMMUTE" : "FULL_TIME",
        "directApply": true,
        "url": job.apply_url,
    }));

    return (
        <main className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <JobsDashboard initialJobs={jobs} error={error} />
            <SeoContent />
        </main>
    );
}
