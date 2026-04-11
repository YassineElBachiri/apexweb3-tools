export function buildAffiliateUrl(baseUrl: string, affiliateId: string, pageId: string): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", "apexweb3");
    url.searchParams.set("utm_medium", "affiliate");
    url.searchParams.set("utm_campaign", affiliateId);
    url.searchParams.set("utm_content", pageId);
    return url.toString();
  } catch (error) {
    // In case of invalid URL fallback to baseUrl
    return baseUrl;
  }
}
