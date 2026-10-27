import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllFeedbacks } from "@/lib/db";
import { aggregateDashboardData, FilterOptions } from "@/lib/aggregate";

const AUTH_COOKIE_NAME = "gentleman_admin_session";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME);

    // Verify session
    if (!session || session.value !== "authenticated_session_token") {
      return NextResponse.json(
        { error: "غير مصرح بالدخول / Unauthorized access to analytics" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const dateRange = (searchParams.get("dateRange") as FilterOptions["dateRange"]) || "all";
    const ageGroup = searchParams.get("ageGroup") || "all";
    const barber = searchParams.get("barber") || "all";

    const records = await getAllFeedbacks();
    const data = aggregateDashboardData(records, { dateRange, ageGroup, barber });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Analytics API Error]", err);
    return NextResponse.json({ error: err.message || "Failed to fetch analytics" }, { status: 500 });
  }
}
