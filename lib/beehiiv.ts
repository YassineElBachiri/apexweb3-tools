// /lib/beehiiv.ts

const BEEHIIV_API_BASE = 'https://api.beehiiv.com/v2';

type SubscribeParams = {
  email: string;
  utm_source: string;       // required — which page/tool triggered this
  utm_medium?: string;      // defaults to 'website'
  utm_campaign?: string;    // defaults to utm_source value
  referring_site?: string;  // defaults to 'https://www.apexweb3.com'
  double_opt_override?: 'on' | 'off' | 'not_set'; // defaults to 'not_set'
  custom_fields?: Array<{ name: string; value: string }>;
};

type BeehiivResponse = {
  success: boolean;
  status?: string;   // 'validating' | 'active' | 'inactive'
  id?: string;       // subscription id
  error?: string;
};

export async function subscribeToBeehiiv(
  params: SubscribeParams
): Promise<BeehiivResponse> {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    console.error('[Beehiiv] Missing API key or Publication ID');
    return { success: false, error: 'Subscription service unavailable' };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(params.email)) {
    return { success: false, error: 'Invalid email address' };
  }

  const endpoint = `${BEEHIIV_API_BASE}/publications/${pubId}/subscriptions`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: params.email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: params.utm_source,
        utm_medium: params.utm_medium || 'website',
        utm_campaign: params.utm_campaign || params.utm_source,
        referring_site: params.referring_site || 'https://www.apexweb3.com',
        double_opt_override: params.double_opt_override || 'not_set',
        custom_fields: params.custom_fields,
      }),
    });

    if (response.status === 400) {
      console.error(`[Beehiiv] 400 Bad Request for source: ${params.utm_source}`);
      return { success: false, error: 'Invalid email address' };
    }

    if (response.status === 429) {
      console.error(`[Beehiiv] 429 Too Many Requests for source: ${params.utm_source}`);
      return { success: false, error: 'Too many requests. Try again shortly.' };
    }

    if (response.status >= 500) {
      console.error(`[Beehiiv] 500+ Error for source: ${params.utm_source}`);
      return { success: false, error: 'Subscription service unavailable' };
    }

    if (response.status === 201) {
      const data = await response.json();
      return {
        success: true,
        status: data.data.status,
        id: data.data.id,
      };
    }

    console.error(`[Beehiiv] Unexpected status ${response.status} for source: ${params.utm_source}`);
    return { success: false, error: 'Subscription service unavailable' };
  } catch (error) {
    console.error(`[Beehiiv] Network error for source: ${params.utm_source}`, error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}
