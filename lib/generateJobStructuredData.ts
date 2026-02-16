import { Web3Job } from "@/types/job";

/**
 * Generates JSON-LD structured data for a JobPosting.
 * 
 * Schema.org reference: https://schema.org/JobPosting
 */
export function generateJobPostingJSONLD(job: Web3Job): string {
    const schema = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description
            ? job.description.replace(/<[^>]+>/g, " ") // Simple strip for safety, though HTML is allowed in description
            : `${job.title} at ${job.company}`,
        "datePosted": job.created_at, // ISO 8601 format assumed
        "employmentType": job.employmentType || "FULL_TIME",
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.company,
            "logo": job.logo || undefined
        },
        // Location handling
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                // Parsing "City, Country" or "City" or "Remote" is tricky without structured data.
                // We'll put the whole string in addressLocality or description
                "addressLocality": job.location || "Remote",
                "addressCountry": "Worldwide" // Default or try to extract from job.location if possible
            }
        },
        "directApply": true,
        "url": job.url, // Original job URL or our internal URL
        "applicationContact": {
            "@type": "ContactPoint",
            "url": job.apply_url
        }
    };

    if (job.remote) {
        // Schema for remote jobs
        // https://developers.google.com/search/docs/appearance/structured-data/job-posting#remote-jobs
        (schema as any)["applicantLocationRequirements"] = {
            "@type": "Country",
            "name": "Worldwide"
        };
        (schema as any)["jobLocationType"] = "TELECOMMUTE";
    }

    return JSON.stringify(schema);
}
