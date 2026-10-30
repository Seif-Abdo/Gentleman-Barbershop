import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllBranches, saveBranches } from "@/lib/db";
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
    return NextResponse.json({ success: true, branches });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
