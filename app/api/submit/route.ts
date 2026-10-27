import { NextResponse } from "next/server";
import { insertFeedback } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Honeypot spam check
    if (body.website_url_check) {
      return NextResponse.json({ success: true, message: "Spam filtered" }, { status: 200 });
    }

    const {
      age,
      barber,
      barberRating,
      barberLikes,
      barberImprovements,
      shopRating,
      shopLikes,
      shopImprovements,
      suggestion,
    } = body;

    // Validation
    if (!barber || !barberRating || !shopRating) {
      return NextResponse.json(
        { error: "يرجى اختيار الحلاق وتقييم الحلاق والصالون / Barber and ratings are required." },
        { status: 400 }
      );
    }

    // Save directly to the website's native database
    const savedRecord = await insertFeedback({
      age: age ? parseInt(String(age), 10) : null,
      barber,
      barberRating: Number(barberRating),
      barberLikes: String(barberLikes || "").trim(),
      barberImprovements: String(barberImprovements || "").trim(),
      shopRating: Number(shopRating),
      shopLikes: String(shopLikes || "").trim(),
      shopImprovements: String(shopImprovements || "").trim(),
      suggestion: String(suggestion || "").trim(),
    });

    return NextResponse.json({
      success: true,
      feedbackId: savedRecord.id,
      ageGroup: savedRecord.ageGroup,
      message: "تم حفظ التقييم بنجاح / Feedback saved successfully",
    });
  } catch (error: any) {
    console.error("[Native Submit API Error]", error);
    return NextResponse.json({ error: error.message || "Submission failed" }, { status: 500 });
  }
}
