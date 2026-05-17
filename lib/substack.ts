// /lib/substack.ts

type SubscribeParams = {
  email: string;
  utm_source: string;
  utm_campaign?: string;
};

type SubstackResponse = {
  success: boolean;
  error?: string;
};

export async function subscribeToSubstack(
  params: SubscribeParams
): Promise<SubstackResponse> {
  const webhookUrl = process.env.SUBSTACK_WEBHOOK_URL;

  // 1. Simulate saving to Next.js Database (Source of Truth)
  console.log(`✅ [Next.js DB] Captured new subscriber: ${params.email} from source: ${params.utm_source}`);

  if (!webhookUrl) {
    console.warn('[Substack] Missing SUBSTACK_WEBHOOK_URL in environment variables. Running in Mock mode.');
    return { success: true };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email,
        source: params.utm_source,
        campaign: params.utm_campaign || params.utm_source,
        timestamp: new Date().toISOString()
      }),
    });

    if (response.ok) {
      console.log(`✅ [Webhook] Successfully synced ${params.email} to automation system.`);
      return { success: true };
    }

    console.error(`[Webhook] Unexpected status ${response.status} for source: ${params.utm_source}`);
    return { success: false, error: 'Subscription service unavailable' };
  } catch (error) {
    console.error(`[Webhook] Network error for source: ${params.utm_source}`, error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}
