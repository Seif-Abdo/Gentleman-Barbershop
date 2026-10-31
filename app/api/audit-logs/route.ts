import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllAuditLogs, clearAuditLogs } from "@/lib/db";

const AUTH_COOKIE_NAME = "gentleman_portal_session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function verifyMasterAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!sessionCookie) return null;
  try {
    const session = JSON.parse(sessionCookie.value);
    if (session.role === "master_admin") return session;
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const master = await verifyMasterAdmin();
  if (!master) {
    return NextResponse.json(
      { error: "سجل العمليات والرقابة متاح حصرياً للمدير العام (Master Admin)" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const action = searchParams.get("action");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const branchId = searchParams.get("branchId");

    let logs = await getAllAuditLogs();

    if (category && category !== "all") {
      logs = logs.filter((l) => l.category === category);
    }

    if (action && action !== "all") {
      logs = logs.filter((l) => l.action === action);
    }

    if (branchId && branchId !== "all") {
      logs = logs.filter((l) => l.branchId === branchId);
    }

    if (search) {
      logs = logs.filter(
        (l) =>
          l.userName?.toLowerCase().includes(search) ||
          l.username?.toLowerCase().includes(search) ||
          l.titleAr?.toLowerCase().includes(search) ||
          l.titleEn?.toLowerCase().includes(search) ||
          l.detailsAr?.toLowerCase().includes(search) ||
          l.detailsEn?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      logs,
      totalCount: logs.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  const master = await verifyMasterAdmin();
  if (!master) {
    return NextResponse.json(
      { error: "مسح سجل العمليات متاح حصرياً للمدير العام" },
      { status: 403 }
    );
  }

  try {
    await clearAuditLogs();
    return NextResponse.json({ success: true, message: "تم تفريغ سجل العمليات بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
