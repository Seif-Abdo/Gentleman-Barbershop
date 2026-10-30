import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllBarbers, saveBarbers } from "@/lib/db";
import { Barber } from "@/config/barbers";

const AUTH_COOKIE_NAME = "gentleman_portal_session";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get("branchId");

    const barbers = await getAllBarbers();
    if (branchId && branchId !== "all") {
      return NextResponse.json(barbers.filter((b) => b.branchId === branchId && b.isActive));
    }
    return NextResponse.json(barbers);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Master Admin modular staff/barbers management
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
        { error: "فقط المدير العام (Master Admin) مصرح له بإدارة فريق العمل." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { barber, action } = body;

    let barbers = await getAllBarbers();

    if (action === "add") {
      if (!barber.id || !barber.nameAr || !barber.branchId) {
        return NextResponse.json(
          { error: "Barber ID, name, and branch are required." },
          { status: 400 }
        );
      }
      barbers.push(barber);
    } else if (action === "update") {
      barbers = barbers.map((b) => (b.id === barber.id ? { ...b, ...barber } : b));
    } else if (action === "delete") {
      barbers = barbers.filter((b) => b.id !== barber.id);
    }

    await saveBarbers(barbers);
    return NextResponse.json({ success: true, barbers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
