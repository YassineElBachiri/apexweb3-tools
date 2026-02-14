import { Web3Job } from "@/types/job";
import { generateJobSlug } from "@/lib/slugify";

const WEB3_CAREER_API_URL = "https://web3.career/api/v1";

const MOCK_JOBS: Web3Job[] = [
    {
        id: "mock-1",
        slug: "senior-solidity-developer-uniswap",
        title: "Senior Solidity Developer",
        description: "Join Uniswap Labs to build the future of decentralized finance. We are looking for a Senior Solidity Developer to lead our smart contract engineering efforts and help scale the protocol to millions of users. You will work on core protocol features and help design the next generation of DeFi primitives.",
        company: "Uniswap Labs",
        location: "New York / Remote",
        remote: true,
        tags: ["Solidity", "Smart Contracts", "DeFi"],
        url: "https://web3.career/senior-solidity-developer-uniswap",
        apply_url: "https://web3.career/senior-solidity-developer-uniswap/apply",
        created_at: new Date().toISOString(),
        salary: "$180k - $250k",
        logo: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
        employmentType: "TELECOMMUTE"
    },
    {
        id: "mock-2",
        slug: "rust-engineer-solana-foundation",
        title: "Rust Core Engineer",
        description: "The Solana Foundation is seeking a Rust Core Engineer to work on the high-performance Solana blockchain. Help us build the fastest, most scalable L1 in the world. You will be responsible for optimizing the validator client, improving peer-to-peer networking, and enhancing the runtime performance of the network.",
        company: "Solana Foundation",
        location: "Remote",
        remote: true,
        tags: ["Rust", "Blockchain", "L1"],
        url: "https://web3.career/rust-engineer-solana-foundation",
        apply_url: "https://web3.career/rust-engineer-solana-foundation/apply",
        created_at: new Date().toISOString(),
        salary: "$160k - $220k",
        logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
        employmentType: "TELECOMMUTE"
    },
    {
        id: "mock-3",
        slug: "frontend-developer-metamask",
        title: "Senior Frontend Developer",
        description: "MetaMask is looking for a Senior Frontend Developer to create beautiful, secure, and intuitive interfaces for the world's leading self-custodial wallet. Help us bridge the gap between Web2 and Web3. You will work with React, TypeScript, and various blockchain libraries to deliver a seamless user experience.",
        company: "MetaMask",
        location: "London / Remote",
        remote: true,
        tags: ["React", "TypeScript", "Web3.js"],
        url: "https://web3.career/frontend-developer-metamask",
        apply_url: "https://web3.career/frontend-developer-metamask/apply",
        created_at: new Date().toISOString(),
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
        console.log(`Fetching jobs from Web3.career (Token prefix: ${TOKEN.substring(0, 4)}...)`);
        const res = await fetch(`${WEB3_CAREER_API_URL}?token=${TOKEN}`, {
            next: { revalidate: 3600 }, // ISR: Revalidate every hour
        });

        if (!res.ok) {
            console.error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
            return { jobs: [], error: "FETCH_ERROR" };
        }

        const data = await res.json();
        console.log("Web3.career API raw data structure:", typeof data, Array.isArray(data) ? `Array[${data.length}]` : "Object");

        if (Array.isArray(data) && data.length > 0) {
            console.log("Web3.career API preview:", JSON.stringify(data[0]).substring(0, 100));
        }

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

            // Robust normalization for description and URLs
            const description = item.description || item.job_description || item.content || "";
            const applyUrl = item.apply_url || item.url || item.link || "#";
            const jobUrl = item.url || item.link || item.apply_url || "#";

            // Improved Salary Construction
            const formatSal = (val: any) => {
                if (!val) return "";
                const num = parseFloat(val);
                if (isNaN(num)) return val;
                // If the number is large (>= 1000), divide by 1000 and append k
                if (num >= 1000) return `${Math.floor(num / 1000)}k`;
                // If it's small (like 80 or 120), it's likely already in k-units
                return `${num}k`;
            };

            let salary = item.salary;
            if (!salary && (item.salary_min_value || item.salary_max_value)) {
                const currency = item.salary_currency || "$";
                const min = item.salary_min_value ? `${currency}${formatSal(item.salary_min_value)}` : "";
                const max = item.salary_max_value ? `${currency}${formatSal(item.salary_max_value)}` : "";
                if (min && max) salary = `${min} - ${max}`;
                else salary = min || max;
            } else if (!salary && (item.estimated_min_salary || item.estimated_max_salary)) {
                const min = formatSal(item.estimated_min_salary);
                const max = formatSal(item.estimated_max_salary);
                if (min && max) salary = `$${min} - $${max} (Est.)`;
                else if (min || max) salary = `$${min || max} (Est.)`;
            }

            const job: Web3Job = {
                id: id,
                slug: "", // Will be generated after
                title: item.title,
                description: description,
                company: item.company || "Unknown Company", // Fallback
                location: item.location || (item.is_remote ? "Remote" : "Unknown"),
                remote: Boolean(item.is_remote), // Normalize 1/0/true/false
                tags: Array.isArray(item.tags) ? item.tags : [],
                url: jobUrl,
                apply_url: applyUrl,
                created_at: item.created_at || item.date || new Date().toISOString(),
                salary: salary,
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
