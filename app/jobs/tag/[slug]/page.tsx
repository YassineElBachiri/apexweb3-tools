import { fetchWeb3Jobs } from "@/lib/web3Career";
import { JobsDashboard } from "@/components/jobs/JobsDashboard";
import { SeoContent } from "@/components/jobs/SeoContent";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tag = decodeURIComponent(slug).replace(/-/g, " ");
    const title = `${tag.charAt(0).toUpperCase() + tag.slice(1)} Web3 Jobs – Remote Careers`;
    const description = `Find the best ${tag} jobs in Web3, Crypto, and Blockchain. Remote, Engineering, Marketing, and more.`;

    return {
        title: title,
        description: description,
        alternates: {
            canonical: `https://apexweb3.com/jobs/tag/${slug}`,
        },
        openGraph: {
            title: title,
            description: description,
            url: `https://apexweb3.com/jobs/tag/${slug}`,
            siteName: "ApexWeb3 Tools",
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
        },
    };
}

export default async function TagJobsPage({ params }: PageProps) {
    const { slug } = await params;
    const { jobs, error } = await fetchWeb3Jobs();

    if (error || !jobs.length) {
        notFound();
    }

    const tag = decodeURIComponent(slug).replace(/-/g, " ").toLowerCase();

    // Server-side filtering
    let filteredJobs = jobs;
    let initialFilters: any = {};

    if (slug === "remote") {
        initialFilters = { remoteOnly: true };
        filteredJobs = jobs.filter(job => job.remote);
    } else {
        initialFilters = { tag: tag };
        filteredJobs = jobs.filter(job => {
            const searchLower = tag;
            const matchesTag = job.tags.some(t => t.toLowerCase().includes(searchLower));
            const matchesTitle = job.title.toLowerCase().includes(searchLower);
            const matchesCompany = job.company.toLowerCase().includes(searchLower);
            return matchesTag || matchesTitle || matchesCompany;
        });
    }

    // Generate JSON-LD for filtered job postings
    const jsonLd = filteredJobs.map((job) => ({
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
        "employmentType": job.employmentType || (job.remote ? "TELECOMMUTE" : "FULL_TIME"),
        "directApply": true,
        "url": `https://apexweb3.com/jobs/${job.slug}`,
        "applicationUrl": job.apply_url,
    }));

    return (
        <main className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <JobsDashboard initialJobs={jobs} error={error} initialFilters={initialFilters} />
            <SeoContent />
        </main>
    );
}

// Generate static params for common tags
export async function generateStaticParams() {
    return [
        { slug: "remote" },
        { slug: "react" },
        { slug: "solidity" },
        { slug: "rust" },
        { slug: "design" },
        { slug: "marketing" },
        { slug: "engineering" },
        { slug: "developer" },
        { slug: "frontend" },
        { slug: "backend" },
    ];
}

// Revalidate every hour
export const revalidate = 3600;
