import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getWhatsAppSettings, saveWhatsAppSettings } from "@/lib/db";
import { WhatsAppSettings } from "@/lib/types";

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const settings = await getWhatsAppSettings();
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const master = await verifyMasterAdmin();
  if (!master) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body: WhatsAppSettings = await req.json();
    await saveWhatsAppSettings({
      phoneNumberId: String(body.phoneNumberId || "").trim(),
      wabaId: String(body.wabaId || "").trim(),
      accessToken: String(body.accessToken || "").trim(),
      testRecipientNumber: String(body.testRecipientNumber || "").trim(),
      isEnabled: Boolean(body.isEnabled),
    });

    return NextResponse.json({
      success: true,
      message: "تم حفظ إعدادات واتساب للأعمال بنجاح / Settings saved",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
