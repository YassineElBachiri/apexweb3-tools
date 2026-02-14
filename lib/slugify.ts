import { Web3Job } from "@/types/job";

/**
 * Convert any text to a URL-friendly slug
 * - Lowercase
 * - Replace spaces/special chars with hyphens
 * - Remove duplicate hyphens
 * - Trim hyphens from ends
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        // Replace spaces and underscores with hyphens
        .replace(/[\s_]+/g, "-")
        // Remove special characters except hyphens
        .replace(/[^\w-]+/g, "")
        // Remove duplicate hyphens
        .replace(/--+/g, "-")
        // Trim hyphens from start and end
        .replace(/^-+|-+$/g, "");
}

/**
 * Generate SEO-friendly slug for a job
 * Format: {job-title}-{company}
 * Example: "senior-solidity-developer-uniswap"
 */
export function generateJobSlug(job: Web3Job): string {
    const titleSlug = slugify(job.title);
    const companySlug = slugify(job.company);

    // Combine title and company, limit total length for URL friendliness
    const combined = `${titleSlug}-${companySlug}`;

    // Limit to 100 characters to keep URLs reasonable
    return combined.substring(0, 100).replace(/-+$/, "");
}

/**
 * Known tag slugs that should be treated as filter pages, not job detail pages
 */
export const KNOWN_TAG_SLUGS = [
    "remote",
    "react",
    "solidity",
    "rust",
    "design",
    "marketing",
    "engineering",
    "developer",
    "frontend",
    "backend",
    "fullstack",
    "defi",
    "nft",
    "web3",
    "blockchain",
    "crypto",
] as const;

/**
 * Check if a slug is a known tag (for routing logic)
 */
export function isTagSlug(slug: string): boolean {
    return KNOWN_TAG_SLUGS.includes(slug as any);
}
