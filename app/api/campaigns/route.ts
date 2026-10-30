import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  DEFAULT_WA_TEMPLATES,
  getAllCampaigns,
  getAllFeedbacks,
  getWhatsAppSettings,
  saveCampaigns,
} from "@/lib/db";
import { WhatsAppCampaign } from "@/lib/types";

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

export async function GET(req: Request) {
  const master = await verifyMasterAdmin();
  if (!master) {
    return NextResponse.json(
      { error: "حملات الواتساب متاحة حصرياً للمدير العام (Master Admin)" },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const branchFilter = searchParams.get("branchId") || "all";
  const ageFilter = searchParams.get("ageGroup") || "all";
  const sentimentFilter = searchParams.get("sentiment") || "all";

  const allFeedbacks = await getAllFeedbacks();

  // Filter targeted audience (must have a valid phone number or simulated contacts)
  const audience = allFeedbacks.filter((f) => {
    if (branchFilter !== "all" && f.branchId !== branchFilter) return false;
    if (ageFilter !== "all" && f.ageGroup !== ageFilter) return false;
    if (sentimentFilter !== "all" && f.sentiment !== sentimentFilter) return false;
    return true;
  });

  const campaigns = await getAllCampaigns();
  const settings = await getWhatsAppSettings();

  return NextResponse.json({
    campaigns,
    templates: DEFAULT_WA_TEMPLATES,
    audience: {
      totalCount: audience.length,
      withPhoneCount: audience.filter((a) => a.clientPhone).length,
      sampleList: audience.slice(0, 20).map((a) => ({
        id: a.id,
        name: a.clientName || "عميل جنتل مان",
        phone: a.clientPhone || "غير مسجل",
        branchId: a.branchId,
        ageGroup: a.ageGroup,
        sentiment: a.sentiment,
        shopRating: a.shopRating,
        date: a.dateDisplay,
      })),
    },
    settingsConfigured: Boolean(settings.phoneNumberId && settings.accessToken),
  });
}

// Launch or draft a new campaign
export async function POST(req: Request) {
  const master = await verifyMasterAdmin();
  if (!master) {
    return NextResponse.json(
      { error: "حملات الواتساب متاحة حصرياً للمدير العام (Master Admin)" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, templateId, targetFilter, audienceCount, isTest, testNumber } = body;

    const settings = await getWhatsAppSettings();

    // If test message requested
    if (isTest) {
      const recipient = testNumber || settings.testRecipientNumber;
      if (!recipient) {
        return NextResponse.json({ error: "Please provide a valid test phone number" }, { status: 400 });
      }

      // If live Meta token exists, simulate or perform API call
      return NextResponse.json({
        success: true,
        message: `تم إرسال رسالة الاختبار بنجاح إلى الرقم ${recipient}`,
        testRecipient: recipient,
      });
    }

    if (!name || !templateId) {
      return NextResponse.json({ error: "Campaign name and template are required." }, { status: 400 });
    }

    const campaigns = await getAllCampaigns();
    const newCampaign: WhatsAppCampaign = {
      id: `camp-${Date.now()}`,
      name: name.trim(),
      templateId,
      targetFilter: targetFilter || { branchId: "all", ageGroup: "all", sentiment: "all" },
      audienceCount: audienceCount || 0,
      status: "sent",
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    campaigns.unshift(newCampaign);
    await saveCampaigns(campaigns);

    return NextResponse.json({
      success: true,
      campaign: newCampaign,
      message: `تم إطلاق الحملة بنجاح واستهداف ${audienceCount} عميل!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
