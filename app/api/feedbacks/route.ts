import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteFeedbacksByIds, deleteFeedbacksByCriteria, logAdminAction } from "@/lib/db";

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

    if (deletedCount > 0) {
      if (type === "ids") {
        await logAdminAction({
          userId: master.id,
          username: master.username,
          userName: master.name,
          userRole: master.role,
          category: "feedback",
          action: "DELETE",
          titleAr: "حذف تقييمات العملاء المحددة",
          titleEn: "Delete Selected Customer Feedbacks",
          detailsAr: `قام بحذف ${deletedCount} سجل من آراء وتقييمات العملاء.`,
          detailsEn: `Deleted ${deletedCount} customer feedback record(s).`,
          metadata: { ids, count: deletedCount },
        });
      } else {
        await logAdminAction({
          userId: master.id,
          username: master.username,
          userName: master.name,
          userRole: master.role,
          branchId: branchId || undefined,
          category: "feedback",
          action: "CLEANUP",
          titleAr: all ? "حذف شامل لكافة آراء العملاء" : "تنظيف وفلترة سجلات العملاء",
          titleEn: all ? "Total Customer Feedbacks Wipeout" : "Filtered Feedbacks Cleanup",
          detailsAr: all
            ? `قام بحذف كافة سجلات العملاء بالكامل (تفريغ شامل: ${deletedCount} سجل).`
            : `تنظيف سجلات فرع (${branchId || "جميع الفروع"}) للفترة (${olderThanDays ? `الأقدم من ${olderThanDays} يوم` : "كل السجلات"})، تم حذف ${deletedCount} سجل.`,
          detailsEn: `Purged ${deletedCount} feedback records (branch: ${branchId || "all"}, olderThan: ${olderThanDays || "all"}).`,
          metadata: { branchId, olderThanDays, all, count: deletedCount },
        });
      }
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
