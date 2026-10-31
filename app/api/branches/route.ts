import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllBranches, saveBranches, logAdminAction } from "@/lib/db";
import { Branch } from "@/config/branches";

const AUTH_COOKIE_NAME = "gentleman_portal_session";

export async function GET() {
  try {
    const branches = await getAllBranches();
    return NextResponse.json(branches);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Master Admin modular branch update / create
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    if (session.role !== "master_admin") {
      return NextResponse.json(
        { error: "فقط المدير العام (Master Admin) مصرح له بإدارة الفروع." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { branch, action } = body; // action: 'add' | 'update' | 'delete'

    let branches = await getAllBranches();

    if (action === "add") {
      if (!branch.id || !branch.nameAr) {
        return NextResponse.json({ error: "Branch ID and Arabic name are required." }, { status: 400 });
      }
      if (branches.some((b) => b.id === branch.id)) {
        return NextResponse.json({ error: "Branch ID already exists." }, { status: 400 });
      }
      branches.push(branch);
    } else if (action === "update") {
      branches = branches.map((b) => (b.id === branch.id ? { ...b, ...branch } : b));
    } else if (action === "delete") {
      branches = branches.filter((b) => b.id !== branch.id);
    }

    await saveBranches(branches);

    // Audit Logging
    const actionMap: Record<string, { act: any; titleAr: string; titleEn: string; descAr: string; descEn: string }> = {
      add: {
        act: "CREATE",
        titleAr: "إضافة فرع جديد للصالون",
        titleEn: "Branch Added",
        descAr: `تمت إضافة فرع جديد (${branch.nameAr} - ${branch.id}).`,
        descEn: `Added new branch (${branch.nameEn || branch.nameAr}).`,
      },
      update: {
        act: "UPDATE",
        titleAr: "تحديث بيانات الفرع",
        titleEn: "Branch Updated",
        descAr: `تم تحديث بيانات وموقع فرع (${branch.nameAr}).`,
        descEn: `Updated details for branch (${branch.nameEn || branch.nameAr}).`,
      },
      delete: {
        act: "DELETE",
        titleAr: "حذف فرع",
        titleEn: "Branch Deleted",
        descAr: `تم حذف فرع (${branch.nameAr || branch.id}) من النظام.`,
        descEn: `Deleted branch (${branch.nameEn || branch.nameAr || branch.id}).`,
      },
    };

    const logInfo = actionMap[action];
    if (logInfo) {
      await logAdminAction({
        userId: session.id,
        username: session.username,
        userName: session.name,
        userRole: session.role,
        branchId: branch.id,
        category: "branches",
        action: logInfo.act,
        titleAr: logInfo.titleAr,
        titleEn: logInfo.titleEn,
        detailsAr: logInfo.descAr,
        detailsEn: logInfo.descEn,
        metadata: { branchId: branch.id, action },
      });
    }

    return NextResponse.json({ success: true, branches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
