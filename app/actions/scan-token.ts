"use server";

import { determineNetwork } from "@/lib/security-service";
import { redirect } from "next/navigation";

export async function processScanAction(formData: FormData): Promise<void> {
    const address = formData.get("address")?.toString()?.trim();

    if (!address) {
        throw new Error("Address is required.");
    }

    let network: string;
    try {
        network = await determineNetwork(address);
    } catch {
        throw new Error("Invalid address format. Please provide a valid ETH or Solana address.");
    }

    // Redirect to the new public SEO token result page.
    // /token/[chain]/[address] handles ISR caching, SEO metadata,
    // share card, FAQ, and IndexNow ping automatically.
    redirect(`/token/${network}/${address}`);
}
