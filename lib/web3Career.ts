import { Web3Job } from "@/types/job";
import { generateJobSlug } from "@/lib/slugify";

const WEB3_CAREER_API_URL = "https://web3.career/api/v1";
const TOKEN = process.env.WEB3_CAREER_TOKEN;

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
    if (!TOKEN) {
        console.warn("WEB3_CAREER_TOKEN is missing in environment variables. Using empty list.");
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
