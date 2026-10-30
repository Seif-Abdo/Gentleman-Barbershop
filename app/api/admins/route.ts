import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAllAdmins, saveAdmins } from "@/lib/db";
import { AdminUser } from "@/lib/types";

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

export async function GET() {
  const master = await verifyMasterAdmin();
  if (!master) {
    return NextResponse.json({ error: "Only Master Admin can view admin accounts" }, { status: 403 });
  }

  const admins = await getAllAdmins();
  // Safe sanitized return (exclude raw passwords from list if desired, but for ease of demo show username)
  return NextResponse.json(
    admins.map((a) => ({
      id: a.id,
      username: a.username,
      name: a.name,
      role: a.role,
      branchId: a.branchId,
      createdAt: a.createdAt,
    }))
  );
}

export async function POST(req: Request) {
  const master = await verifyMasterAdmin();
  if (!master) {
    return NextResponse.json({ error: "Only Master Admin can manage admin accounts" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, admin } = body;

    let admins = await getAllAdmins();

    if (action === "add") {
      if (!admin.username || !admin.password || !admin.name) {
        return NextResponse.json(
          { error: "Username, password, and name are required." },
          { status: 400 }
        );
      }
      if (admins.some((a) => a.username.toLowerCase() === admin.username.toLowerCase())) {
        return NextResponse.json({ error: "Username already exists." }, { status: 400 });
      }

      const newAdmin: AdminUser = {
        id: `admin-${Date.now()}`,
        username: admin.username.trim(),
        name: admin.name.trim(),
        role: admin.role || "branch_admin",
        branchId: admin.branchId || "zahraa-maadi",
        password: admin.password,
        createdAt: new Date().toISOString(),
      };
      admins.push(newAdmin);
    } else if (action === "update") {
      admins = admins.map((a) => (a.id === admin.id ? { ...a, ...admin } : a));
    } else if (action === "delete") {
      // Prevent deleting last master admin
      if (admin.id === "admin-master") {
        return NextResponse.json({ error: "Cannot delete the default Master Admin account." }, { status: 400 });
      }
      admins = admins.filter((a) => a.id !== admin.id);
    }

    await saveAdmins(admins);
    return NextResponse.json({ success: true, message: "Admins updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
