import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse, SecurityScanResult } from "@/types";
import { generateSecurityData } from "@/lib/mock-generator";

export const revalidate = 120; // Revalidate every 120 seconds

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get("address");

        if (!address) {
            return NextResponse.json<ApiResponse<null>>({
                success: false,
                error: "Address parameter is required",
                timestamp: Date.now(),
            }, { status: 400 });
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return NextResponse.json<ApiResponse<null>>({
                success: false,
                error: "Invalid token contract address format",
                timestamp: Date.now(),
            }, { status: 400 });
        }

        const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || !process.env.NEXT_PUBLIC_GOPLUS_API_KEY;

        if (useMockData) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockData = generateSecurityData(address);

            return NextResponse.json<ApiResponse<SecurityScanResult>>({
                success: true,
                data: mockData,
                cached: false,
                timestamp: Date.now(),
            });
        }

        // TODO: Implement real GoPlus API call
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: "Real API integration not yet implemented. Set NEXT_PUBLIC_USE_MOCK_DATA=true to use mock data.",
            timestamp: Date.now(),
        }, { status: 501 });

    } catch (error) {
        console.error("Security API error:", error);
        return NextResponse.json<ApiResponse<null>>({
            success: false,
            error: "Internal server error",
            timestamp: Date.now(),
        }, { status: 500 });
    }
}
