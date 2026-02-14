export interface Web3Job {
    id: string; // Adjusted to string to be safe, can be number
    slug: string; // SEO-friendly URL slug (required for job detail pages)
    title: string;
    description?: string;
    company: string; // Mapped from company_name usually
    location: string;
    remote: boolean;
    tags: string[]; // Normalized tags
    url: string; // The apply URL
    created_at: string; // ISO date or string
    apply_url: string; // Explicit apply URL if different
    salary?: string;
    logo?: string; // Company logo URL
    employmentType?: string; // FULL_TIME, PART_TIME, CONTRACT, etc.
}

export interface JobFilter {
    remoteOnly: boolean;
    country: string;
    tag: string;
    limit: number;
}
