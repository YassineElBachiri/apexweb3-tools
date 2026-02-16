/**
 * Generates a concise summary from a job description.
 * 
 * Logic:
 * 1. Strips HTML tags.
 * 2. Splits text into sentences.
 * 3. Takes the first 2-4 sentences.
 * 4. Truncates to ~160-180 characters while trying to keep complete sentences.
 */
export function generateJobSummary(description: string): string {
    if (!description) return "";

    // 1. Strip HTML
    const plainText = description
        .replace(/<[^>]+>/g, " ") // Replace tags with spaces
        .replace(/\s+/g, " ")     // Collapse multiple spaces
        .trim();

    // 2. Split into sentences (rudimentary split by .!? followed by space)
    // This regex matches periods, exclamation marks, or question marks followed by a space or end of string
    const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [plainText];

    // 3. Take first few sentences
    let summary = "";
    for (let i = 0; i < sentences.length && i < 4; i++) {
        const sentence = sentences[i].trim();
        if ((summary + sentence).length > 180) {
            if (summary.length === 0) {
                // If the first sentence is too long, truncate it hard
                return sentence.substring(0, 157) + "...";
            }
            break;
        }
        summary += (summary ? " " : "") + sentence;
    }

    // Fallback if regex failed or text is weird
    if (!summary) {
        summary = plainText.substring(0, 157) + (plainText.length > 157 ? "..." : "");
    }

    return summary;
}
