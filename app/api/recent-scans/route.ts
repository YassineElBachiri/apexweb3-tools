// app/api/recent-scans/route.ts
import { NextResponse } from "next/server";
import { getRecentScans, getTodayCount } from "@/lib/scan-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    const scans = getRecentScans(30);
    const todayCount = getTodayCount();

    return NextResponse.json({
        scans,
        todayCount: Math.max(todayCount, 14832), // seed floor for social proof
    });
}
