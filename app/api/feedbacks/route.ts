import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteFeedbacksByIds, deleteFeedbacksByCriteria } from "@/lib/db";

const AUTH_COOKIE_NAME = "gentleman_portal_session";

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

export async function DELETE(req: Request) {
  try {
    const master = await verifyMasterAdmin();
    if (!master) {
      return NextResponse.json(
        {
          error:
            "غير مصرح بهذا الإجراء. صلاحية حذف بيانات العملاء مقتصرة فقط على المدير العام (Master Admin).",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { type, ids, branchId, olderThanDays, all } = body;

    let deletedCount = 0;

    if (type === "ids") {
      if (!Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          { error: "لم يتم تحديد أي سجلات لحذفها." },
          { status: 400 }
        );
      }
      deletedCount = await deleteFeedbacksByIds(ids);
    } else if (type === "criteria") {
      deletedCount = await deleteFeedbacksByCriteria({
        branchId: branchId || undefined,
        olderThanDays: olderThanDays ? Number(olderThanDays) : undefined,
        all: Boolean(all),
      });
    } else {
      return NextResponse.json(
        { error: "نوع طلب الحذف غير صالح." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      count: deletedCount,
      message: `تم حذف ${deletedCount} سجل بنجاح.`,
    });
  } catch (err: any) {
    console.error("[Feedbacks DELETE Error]", err);
    return NextResponse.json(
      { error: err.message || "حدث خطأ أثناء محاولة حذف البيانات." },
      { status: 500 }
    );
  }
}
