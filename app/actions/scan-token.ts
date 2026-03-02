"use server";

import { determineNetwork } from "@/lib/security-service";
import { redirect } from "next/navigation";

export async function processScanAction(formData: FormData) {
    const address = formData.get("address")?.toString()?.trim();

    if (!address) {
        return { error: "Address is required." };
    }

    let network: string;
    try {
        network = await determineNetwork(address);
    } catch (error) {
        return { error: "Invalid address format. Please provide a valid ETH or Solana address." };
    }

    redirect(`/analysis/security-scanner/${network}/${address}`);
}
