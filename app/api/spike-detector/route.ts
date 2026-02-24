import { NextResponse } from "next/server";
import { getSpikingTokens } from "@/lib/actions/spike-detector";

export async function GET() {
    try {
        const result = await getSpikingTokens();
        if ("error" in result) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("Spike Detector API Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
