import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllFeedbacks } from "@/lib/db";
import { aggregateDashboardData, FilterOptions } from "@/lib/aggregate";

const AUTH_COOKIE_NAME = "gentleman_portal_session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

    // Verify session
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "غير مصرح بالدخول / Unauthorized access to portal analytics" },
        { status: 401 }
      );
    }

    let user: any;
    try {
      user = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedBranch = searchParams.get("branchId") || "all";
    const dateRange = (searchParams.get("dateRange") as FilterOptions["dateRange"]) || "all";
    const ageGroup = searchParams.get("ageGroup") || "all";
    const barber = searchParams.get("barber") || "all";

    // RBAC: If branch admin, enforce their branch
    let effectiveBranchId = requestedBranch;
    if (user.role === "branch_admin") {
      effectiveBranchId = user.branchId; // strictly enforce their dedicated branch
    }

    const records = await getAllFeedbacks();
    const data = aggregateDashboardData(records, {
      branchId: effectiveBranchId,
      dateRange,
      ageGroup,
      barber,
    });

    return NextResponse.json({
      ...data,
      userRole: user.role,
      userBranchId: user.branchId,
      activeBranchId: effectiveBranchId,
    });
  } catch (err: any) {
    console.error("[Analytics API Error]", err);
    return NextResponse.json({ error: err.message || "Failed to fetch analytics" }, { status: 500 });
  }
}
