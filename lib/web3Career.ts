import { Web3Job } from "@/types/job";
import { generateJobSlug } from "@/lib/slugify";

const WEB3_CAREER_API_URL = "https://web3.career/api/v1";

const MOCK_JOBS: Web3Job[] = [
    {
        id: "mock-1",
        slug: "senior-solidity-developer-uniswap",
        title: "Senior Solidity Developer",
        company: "Uniswap Labs",
        location: "New York / Remote",
        remote: true,
        tags: ["Solidity", "Smart Contracts", "DeFi"],
        url: "https://web3.career",
        apply_url: "https://web3.career",
        created_at: new Object().toString(),
        salary: "$180k - $250k",
        logo: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
        employmentType: "TELECOMMUTE"
    },
    {
        id: "mock-2",
        slug: "rust-engineer-solana-foundation",
        title: "Rust Core Engineer",
        company: "Solana Foundation",
        location: "Remote",
        remote: true,
        tags: ["Rust", "Blockchain", "L1"],
        url: "https://web3.career",
        apply_url: "https://web3.career",
        created_at: new Object().toString(),
        salary: "$160k - $220k",
        logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
        employmentType: "TELECOMMUTE"
    },
    {
        id: "mock-3",
        slug: "frontend-developer-metamask",
        title: "Senior Frontend Developer",
        company: "MetaMask",
        location: "London / Remote",
        remote: true,
        tags: ["React", "TypeScript", "Web3.js"],
        url: "https://web3.career",
        apply_url: "https://web3.career",
        created_at: new Object().toString(),
        salary: "$140k - $190k",
        logo: "https://cryptologos.cc/logos/metamask-eth-logo.png",
        employmentType: "TELECOMMUTE"
    }
];

// Interface for the raw API response to help with normalization
interface Web3CareerResponseItem {
    id: string | number;
    title: string;
    description: string;
    company: string;
    location: string;
    is_remote: boolean | number;
    tags: string[];
    url: string;
    apply_url: string;
    created_at: string;
    salary?: string;
    logo?: string;
    [key: string]: any; // Catch-all for other fields
}

export type FetchJobsResult = {
    jobs: Web3Job[];
    error?: string;
};

export async function fetchWeb3Jobs(): Promise<FetchJobsResult> {
    const TOKEN = process.env.WEB3_CAREER_TOKEN;
    const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

    if (USE_MOCK) {
        console.log("Using mock Web3 jobs data (NEXT_PUBLIC_USE_MOCK_DATA is true)");
        return { jobs: MOCK_JOBS };
    }

    if (!TOKEN) {
        console.warn("WEB3_CAREER_TOKEN is missing in environment variables. Falling back to mock data in development.");
        if (process.env.NODE_ENV === "development") {
            return { jobs: MOCK_JOBS, error: "MISSING_TOKEN_DEV" };
        }
        return { jobs: [], error: "MISSING_TOKEN" };
    }

    try {
        const res = await fetch(`${WEB3_CAREER_API_URL}?token=${TOKEN}`, {
            next: { revalidate: 3600 }, // ISR: Revalidate every hour
        });

        if (!res.ok) {
            console.error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
            return { jobs: [], error: "FETCH_ERROR" };
        }

        const data = await res.json();

        let jobsArray: Web3CareerResponseItem[] = [];

        // API returns [meta_string, info_string, jobs_array]
        if (Array.isArray(data)) {
            // Find the element that is an array of objects (the jobs)
            const potentialJobs = data.find(item => Array.isArray(item) && item.length > 0 && typeof item[0] === 'object');
            if (potentialJobs) {
                jobsArray = potentialJobs;
            } else if (data.length > 2 && Array.isArray(data[2])) {
                // Fallback to index 2 if heuristic fails but strict structure matches
                jobsArray = data[2];
            } else {
                // Fallback: assume the top level array *is* the jobs if it contains objects
                // But we know it contains strings too, so better to rely on finding the nested array
                jobsArray = []; // If we can't find the nested array, default to empty to avoid crashing on strings
            }
        } else if (data && data.jobs && Array.isArray(data.jobs)) {
            // Handle standard object wrapper { jobs: [...] } if API changes
            jobsArray = data.jobs;
        }

        // Deduplicate by ID
        const seenIds = new Set();
        const normalizedJobs: Web3Job[] = [];

        for (const item of jobsArray) {
            const id = String(item.id);
            if (seenIds.has(id)) continue;
            // Skip invalid items (ensure title exists)
            if (!item.title) continue;

            seenIds.add(id);

            const job: Web3Job = {
                id: id,
                slug: "", // Will be generated after
                title: item.title,
                description: item.description,
                company: item.company || "Unknown Company", // Fallback
                location: item.location || (item.is_remote ? "Remote" : "Unknown"),
                remote: Boolean(item.is_remote), // Normalize 1/0/true/false
                tags: Array.isArray(item.tags) ? item.tags : [],
                url: item.url || item.apply_url || "#",
                apply_url: item.apply_url || item.url || "#", // Fallback to url if apply_url missing
                created_at: item.created_at,
                salary: item.salary,
                logo: item.logo,
                employmentType: item.remote ? "TELECOMMUTE" : "FULL_TIME"
            };

            // Generate slug after we have the complete job object
            job.slug = generateJobSlug(job);
            normalizedJobs.push(job);
        }

        return { jobs: normalizedJobs };

    } catch (error) {
        console.error("Error fetching Web3 jobs:", error);
        return { jobs: [], error: "UNKNOWN_ERROR" };
    }
}

/**
 * Fetch a single job by its slug
 * This is used for individual job detail pages
 */
export async function fetchJobBySlug(slug: string): Promise<Web3Job | null> {
    const { jobs } = await fetchWeb3Jobs();

    // Find job with matching slug
    const job = jobs.find(j => j.slug === slug);

    return job || null;
}

/**
 * Fetch all jobs and return them as a map keyed by slug
 * Useful for related jobs lookup
 */
export async function fetchJobsMap(): Promise<Map<string, Web3Job>> {
    const { jobs } = await fetchWeb3Jobs();
    const map = new Map<string, Web3Job>();

    jobs.forEach(job => {
        map.set(job.slug, job);
    });

    return map;
}
