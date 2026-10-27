import { NextResponse } from "next/server";
import { FORM_CONFIG } from "@/config/form.config";
import { addRuntimeFeedback } from "@/lib/sheets";
import { normalizeRecord } from "@/lib/normalize";

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

    // Basic validation
    if (!barber || !barberRating || !shopRating) {
      return NextResponse.json(
        { error: "Barber, barber rating, and shop rating are required." },
        { status: 400 }
      );
    }

    // 1. Prepare Google Forms POST parameters
    const params = new URLSearchParams();

    // Add hidden accidental required question
    for (const [key, val] of Object.entries(FORM_CONFIG.hiddenDefaults)) {
      params.append(key, val);
    }

    // Question: اسم حلاق المره السابقه
    params.append(FORM_CONFIG.barberSelectEntry, barber);

    // Question: Individual Barber Rating
    const barberRatingEntryId = FORM_CONFIG.barberRatingEntries[barber];
    const textBarberRating = FORM_CONFIG.ratingScaleMap[Number(barberRating)] || "ممتاز";
    if (barberRatingEntryId) {
      params.append(barberRatingEntryId, textBarberRating);
    }

    // Combine barber feedback
    const combinedBarberFeedback = [
      barberLikes ? `أعجبني: ${barberLikes}` : "",
      barberImprovements ? `ملاحظات تحسين: ${barberImprovements}` : "",
    ]
      .filter(Boolean)
      .join(" | ") || "تقييم جيد";
    params.append(FORM_CONFIG.barberFeedbackEntry, combinedBarberFeedback);

    // Combine shop feedback
    const combinedShopFeedback = [
      shopLikes ? `أعجبني في المحل: ${shopLikes}` : "",
      shopImprovements ? `ملاحظات تحسين: ${shopImprovements}` : "",
    ]
      .filter(Boolean)
      .join(" | ") || "خدمة ممتازة ومحل راقي";
    params.append(FORM_CONFIG.shopFeedbackEntry, combinedShopFeedback);

    // Question: أضف اقتراحك للحصول على أفضل خدمه
    const combinedSuggestion = String(suggestion || "شكراً لكم والتجربة ممتازة").trim();
    params.append(FORM_CONFIG.suggestionEntry, combinedSuggestion);

    // Question: تقييمك للمحل ككل
    const textShopRating = FORM_CONFIG.ratingScaleMap[Number(shopRating)] || "ممتاز";
    params.append(FORM_CONFIG.shopRatingEntry, textShopRating);

    // Include multi-page history
    params.append("pageHistory", FORM_CONFIG.pageHistory);

    // 2. Forward to Google Form /formResponse
    let googleSuccess = false;
    try {
      const gfResponse = await fetch(FORM_CONFIG.responseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: params.toString(),
      });

      // Google returns 200 or 302 on submission
      googleSuccess = gfResponse.status >= 200 && gfResponse.status < 400;
      console.log(`[GoogleForm Submit] Status: ${gfResponse.status}`);
    } catch (err) {
      console.warn("[GoogleForm Submit] Forwarding failed:", err);
    }

    // 3. Immediately store in runtime memory so it reflects instantly on the dashboard
    const normalized = normalizeRecord({
      id: `live-${Date.now()}`,
      timestamp: new Date().toISOString(),
      age: age ? parseInt(String(age), 10) : null,
      barber,
      barberRating: Number(barberRating),
      barberFeedback: combinedBarberFeedback,
      barberLikes,
      barberImprovements,
      shopRating: Number(shopRating),
      shopFeedback: combinedShopFeedback,
      shopLikes,
      shopImprovements,
      suggestion: combinedSuggestion,
    });

    addRuntimeFeedback(normalized);

    return NextResponse.json({
      success: true,
      googleSubmitted: googleSuccess,
      feedbackId: normalized.id,
      ageGroup: normalized.ageGroup,
    });
  } catch (error: any) {
    console.error("[Submit API Error]", error);
    return NextResponse.json({ error: error.message || "Submission failed" }, { status: 500 });
  }
}
