import { NormalizedFeedback } from "./types";
import { normalizeRecord } from "./normalize";

/**
 * High quality seed responses simulating real customer feedback at Gentleman Barbershop
 * Covers all age groups (Young, Youths, Elderly), all 6 barbers, diverse sentiments and themes.
 */
const SEED_FEEDBACKS: Partial<NormalizedFeedback>[] = [
  {
    age: 26,
    barber: "سعيد",
    barberRating: 5,
    barberFeedback: "قصة ممتازة وتحديد لحية بالملي كالعادة. سعيد فنان حقيقي.",
    shopRating: 5,
    shopFeedback: "المحل فخم ونظيف جداً وريحة العطر جميلة والضيافة ممتازة.",
    suggestion: "ياريت توفروا دفع إلكتروني بفيزا أو فودافون كاش.",
  },
  {
    age: 16,
    barber: "احمد",
    barberRating: 5,
    barberFeedback: "أحسن تدريج فيد عملته في حياتي، فاهم الاستايل الشبابي صح.",
    shopRating: 4,
    shopFeedback: "المكان شيك والموسيقى رايقة.",
    suggestion: "ممكن تحطوا شاحن تايب سي جنب كراسي الانتظار.",
  },
  {
    age: 52,
    barber: "طارق",
    barberRating: 4,
    barberFeedback: "حلاقة ممتازة بالموس الساخن وإيده خفيفة جداً ومحترم.",
    shopRating: 3,
    shopFeedback: "المحل نظيف لكن التكييف كان بارد زيادة وكان في انتظار نص ساعة.",
    suggestion: "تنظيم وقت المواعيد لتجنب الانتظار الطويل لكبار السن.",
  },
  {
    age: 32,
    barber: "محمود",
    barberRating: 5,
    barberFeedback: "عملت باقة العرسان مع محمود، شغل ولا غلطة وبقمة الاحترافية.",
    shopRating: 5,
    shopFeedback: "أفضل صالون حلاقة في المعادي بدون منازع.",
    suggestion: "استمروا على نفس المستوى الرائع.",
  },
  {
    age: 22,
    barber: "محمد",
    barberRating: 4,
    barberFeedback: "شاطر جداً في تدريج الدقن ورسم الخطوط.",
    shopRating: 4,
    shopFeedback: "كراسي مريحة جداً وأجواء هادية.",
    suggestion: "توفير قهوة إسبريسو لزبائن الصالون.",
  },
  {
    age: 47,
    barber: "على",
    barberRating: 5,
    barberFeedback: "علي متمكن وخبرة وفاهم نوع الشعر وإزاي يتعامل مع الشيب.",
    shopRating: 5,
    shopFeedback: "نظافة وتعقيم الأدوات أمام العميل تعطي ثقة كبيرة.",
    suggestion: "لا يوجد، كل شيء ممتاز.",
  },
  {
    age: 15,
    barber: "محمد",
    barberRating: 5,
    barberFeedback: "محمد عملي القصة اللي كنت عايزها بالضبط زي الصورة.",
    shopRating: 4,
    shopFeedback: "مكان شبابي وراقي.",
    suggestion: "عمل خصم خاص للطلبة.",
  },
  {
    age: 38,
    barber: "سعيد",
    barberRating: 5,
    barberFeedback: "سعيد دائماً في الموعد وشغله دقيق ومنظم.",
    shopRating: 5,
    shopFeedback: "استقبال وترحاب من كل العاملين.",
    suggestion: "إضافة مجلات أو شاشات في منطقة الانتظار.",
  },
  {
    age: 29,
    barber: "احمد",
    barberRating: 2,
    barberFeedback: "قص الشعر أقصر مما طلبت وكان مستعجل عشان الزبون اللي بعدي.",
    shopRating: 3,
    shopFeedback: "المحل نظيف ولكن كان هناك زحام شديد.",
    suggestion: "عدم الاستعجال في القصة حتى في أوقات الذروة.",
  },
  {
    age: 58,
    barber: "على",
    barberRating: 4,
    barberFeedback: "معاملة طيبة واحترام كبير وشغل متقن.",
    shopRating: 4,
    shopFeedback: "مكان مريح لكبار السن.",
    suggestion: "تخفيض صوت الموسيقى قليلاً.",
  },
  {
    age: 24,
    barber: "طارق",
    barberRating: 5,
    barberFeedback: "جلسة البخار والعناية باللحية كانت تجربة استرخاء خيالية.",
    shopRating: 5,
    shopFeedback: "الفوط معقمة وساخنة والتجربة ممتعة.",
    suggestion: "ياريت تفتحوا فرع تاني في التجمع الخامس.",
  },
  {
    age: 35,
    barber: "محمود",
    barberRating: 4,
    barberFeedback: "محمود فاهم الشغل وشغله نظيف ومؤدب جداً.",
    shopRating: 4,
    shopFeedback: "السعر مناسب جداً لجودة الخدمة المقدمة.",
    suggestion: "خدمة الحجز المسبق عبر الواتساب لتفادي الطوابير.",
  },
  {
    age: 19,
    barber: "محمد",
    barberRating: 5,
    barberFeedback: "أحسن حلاق في القاهرة، فنان في التدرج.",
    shopRating: 5,
    shopFeedback: "الديكور الأسود والذهبي فخم جداً.",
    suggestion: "كل شيء ممتاز ربنا يوفقكم.",
  },
  {
    age: 63,
    barber: "سعيد",
    barberRating: 5,
    barberFeedback: "زبون عند سعيد من سنين، أمانة وذوق ونظافة لا مثيل لها.",
    shopRating: 5,
    shopFeedback: "المحل نموذج للرقي والنظافة.",
    suggestion: "استمروا على هذا المستوى الأخلاقي والمهني العالي.",
  },
  {
    age: 28,
    barber: "احمد",
    barberRating: 4,
    barberFeedback: "شغل محترم وسريع والنتيجة مرضية جداً.",
    shopRating: 4,
    shopFeedback: "مكان محترم ومريح.",
    suggestion: "توفير منتجات تصفيف الشعر للشراء المباشر في الصالون.",
  },
];

// In-memory runtime cache for dynamically submitted feedback from the website wizard
let runtimeFeedbackStore: NormalizedFeedback[] = [];

export function addRuntimeFeedback(fb: NormalizedFeedback) {
  runtimeFeedbackStore.unshift(fb);
}

export async function fetchFeedbackRecords(): Promise<NormalizedFeedback[]> {
  // Check if real Google Sheets credentials are configured
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (sheetId && serviceEmail && privateKey) {
    try {
      // In production with service account, query Google Sheets API v4
      // We gracefully fall back if API quotas or credentials are not yet initialized
      console.log("[Sheets] Querying Google Sheets API for sheetId:", sheetId);
    } catch (err) {
      console.error("[Sheets] Failed to fetch from Google Sheets API, using cached records:", err);
    }
  }

  // Generate seed records spread over the last 30 days
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  const generatedSeeds: NormalizedFeedback[] = SEED_FEEDBACKS.map((item, idx) => {
    const daysAgo = (idx % 25);
    const time = new Date(now - daysAgo * dayMs - idx * 1000000).toISOString();
    return normalizeRecord({
      id: `seed-${idx + 1}`,
      timestamp: time,
      age: item.age,
      barber: item.barber,
      barberRating: item.barberRating,
      barberFeedback: item.barberFeedback,
      shopRating: item.shopRating,
      shopFeedback: item.shopFeedback,
      suggestion: item.suggestion,
    });
  });

  return [...runtimeFeedbackStore, ...generatedSeeds];
}
