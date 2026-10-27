import fs from "node:fs/promises";
import path from "node:path";
import { NormalizedFeedback } from "./types";
import { normalizeRecord } from "./normalize";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "feedbacks.json");

// Seed records to ensure dashboard has immediate rich metrics out of the box
const DEFAULT_SEED_DATA = [
  {
    age: 26,
    barber: "سعيد",
    barberRating: 5,
    barberLikes: "قصة ممتازة وتحديد لحية بالملي كالعادة. سعيد فنان حقيقي.",
    barberImprovements: "",
    shopRating: 5,
    shopLikes: "المحل فخم ونظيف جداً وريحة العطر جميلة والضيافة ممتازة.",
    shopImprovements: "",
    suggestion: "ياريت توفروا دفع إلكتروني بفيزا أو فودافون كاش.",
  },
  {
    age: 16,
    barber: "احمد",
    barberRating: 5,
    barberLikes: "أحسن تدريج فيد عملته في حياتي، فاهم الاستايل الشبابي صح.",
    barberImprovements: "",
    shopRating: 4,
    shopLikes: "المكان شيك والموسيقى رايقة.",
    shopImprovements: "",
    suggestion: "ممكن تحطوا شاحن تايب سي جنب كراسي الانتظار.",
  },
  {
    age: 52,
    barber: "طارق",
    barberRating: 4,
    barberLikes: "حلاقة ممتازة بالموس الساخن وإيده خفيفة جداً ومحترم.",
    barberImprovements: "تنسيق المواعيد أفضل",
    shopRating: 3,
    shopLikes: "المحل نظيف",
    shopImprovements: "التكييف كان بارد زيادة وكان في انتظار نص ساعة.",
    suggestion: "تنظيم وقت المواعيد لتجنب الانتظار الطويل لكبار السن.",
  },
  {
    age: 32,
    barber: "محمود",
    barberRating: 5,
    barberLikes: "عملت باقة العرسان مع محمود، شغل ولا غلطة وبقمة الاحترافية.",
    barberImprovements: "",
    shopRating: 5,
    shopLikes: "أفضل صالون حلاقة في المعادي بدون منازع.",
    shopImprovements: "",
    suggestion: "استمروا على نفس المستوى الرائع.",
  },
  {
    age: 22,
    barber: "محمد",
    barberRating: 4,
    barberLikes: "شاطر جداً في تدريج الدقن ورسم الخطوط.",
    barberImprovements: "",
    shopRating: 4,
    shopLikes: "كراسي مريحة جداً وأجواء هادية.",
    shopImprovements: "",
    suggestion: "توفير قهوة إسبريسو لزبائن الصالون.",
  },
  {
    age: 47,
    barber: "على",
    barberRating: 5,
    barberLikes: "علي متمكن وخبرة وفاهم نوع الشعر وإزاي يتعامل مع الشيب.",
    barberImprovements: "",
    shopRating: 5,
    shopLikes: "نظافة وتعقيم الأدوات أمام العميل تعطي ثقة كبيرة.",
    shopImprovements: "",
    suggestion: "لا يوجد، كل شيء ممتاز.",
  },
  {
    age: 15,
    barber: "محمد",
    barberRating: 5,
    barberLikes: "محمد عملي القصة اللي كنت عايزها بالضبط زي الصورة.",
    barberImprovements: "",
    shopRating: 4,
    shopLikes: "مكان شبابي وراقي.",
    shopImprovements: "",
    suggestion: "عمل خصم خاص للطلبة.",
  },
  {
    age: 38,
    barber: "سعيد",
    barberRating: 5,
    barberLikes: "سعيد دائماً في الموعد وشغله دقيق ومنظم.",
    barberImprovements: "",
    shopRating: 5,
    shopLikes: "استقبال وترحاب من كل العاملين.",
    shopImprovements: "",
    suggestion: "إضافة شاشات لعرض مباريات في منطقة الانتظار.",
  },
  {
    age: 29,
    barber: "احمد",
    barberRating: 2,
    barberLikes: "قصة عادية",
    barberImprovements: "قص الشعر أقصر مما طلبت وكان مستعجل عشان الزبون اللي بعدي.",
    shopRating: 3,
    shopLikes: "المحل نظيف",
    shopImprovements: "زحام شديد بدون تنظيم",
    suggestion: "عدم الاستعجال في القصة حتى في أوقات الذروة.",
  },
  {
    age: 58,
    barber: "على",
    barberRating: 4,
    barberLikes: "معاملة طيبة واحترام كبير وشغل متقن.",
    barberImprovements: "",
    shopRating: 4,
    shopLikes: "مكان مريح لكبار السن.",
    shopImprovements: "",
    suggestion: "تخفيض صوت الموسيقى قليلاً.",
  },
  {
    age: 24,
    barber: "طارق",
    barberRating: 5,
    barberLikes: "جلسة البخار والعناية باللحية كانت تجربة استرخاء خيالية.",
    barberImprovements: "",
    shopRating: 5,
    shopLikes: "الفوط معقمة وساخنة والتجربة ممتعة.",
    shopImprovements: "",
    suggestion: "ياريت تفتحوا فرع تاني في التجمع الخامس.",
  },
  {
    age: 35,
    barber: "محمود",
    barberRating: 4,
    barberLikes: "محمود فاهم الشغل وشغله نظيف ومؤدب جداً.",
    barberImprovements: "",
    shopRating: 4,
    shopLikes: "السعر مناسب جداً لجودة الخدمة المقدمة.",
    shopImprovements: "",
    suggestion: "خدمة الحجز المسبق عبر الواتساب لتفادي الطوابير.",
  },
  {
    age: 19,
    barber: "محمد",
    barberRating: 5,
    barberLikes: "أحسن حلاق في القاهرة، فنان في التدرج.",
    barberImprovements: "",
    shopRating: 5,
    shopLikes: "الديكور الأسود والذهبي فخم جداً.",
    shopImprovements: "",
    suggestion: "كل شيء ممتاز ربنا يوفقكم.",
  },
  {
    age: 63,
    barber: "سعيد",
    barberRating: 5,
    barberLikes: "زبون عند سعيد من سنين، أمانة وذوق ونظافة لا مثيل لها.",
    barberImprovements: "",
    shopRating: 5,
    shopLikes: "المحل نموذج للرقي والنظافة.",
    shopImprovements: "",
    suggestion: "استمروا على هذا المستوى الأخلاقي والمهني العالي.",
  },
  {
    age: 28,
    barber: "احمد",
    barberRating: 4,
    barberLikes: "شغل محترم وسريع والنتيجة مرضية جداً.",
    barberImprovements: "",
    shopRating: 4,
    shopLikes: "مكان محترم ومريح.",
    shopImprovements: "",
    suggestion: "توفير منتجات تصفيف الشعر للشراء المباشر في الصالون.",
  },
];

// In-memory cache to guarantee fast response times
let inMemoryFeedbacks: NormalizedFeedback[] | null = null;

async function ensureDbInitialized(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      // File does not exist, initialize with seed records
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      const initial: NormalizedFeedback[] = DEFAULT_SEED_DATA.map((seed, idx) => {
        const daysAgo = idx % 28;
        const time = new Date(now - daysAgo * dayMs - idx * 100000).toISOString();
        return normalizeRecord({
          id: `seed-${idx + 1}`,
          timestamp: time,
          age: seed.age,
          barber: seed.barber,
          barberRating: seed.barberRating,
          barberLikes: seed.barberLikes,
          barberImprovements: seed.barberImprovements,
          shopRating: seed.shopRating,
          shopLikes: seed.shopLikes,
          shopImprovements: seed.shopImprovements,
          suggestion: seed.suggestion,
        });
      });

      await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      inMemoryFeedbacks = initial;
    }
  } catch (err) {
    console.error("[Database] Initialization error:", err);
  }
}

export async function getAllFeedbacks(): Promise<NormalizedFeedback[]> {
  await ensureDbInitialized();

  if (inMemoryFeedbacks) {
    return inMemoryFeedbacks;
  }

  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    const parsed: NormalizedFeedback[] = JSON.parse(raw);
    inMemoryFeedbacks = parsed;
    return parsed;
  } catch (err) {
    console.error("[Database] Failed to read feedbacks file:", err);
    return [];
  }
}

export async function insertFeedback(input: {
  age?: number | string | null;
  barber: string;
  barberRating: number;
  barberLikes?: string;
  barberImprovements?: string;
  shopRating: number;
  shopLikes?: string;
  shopImprovements?: string;
  suggestion?: string;
}): Promise<NormalizedFeedback> {
  await ensureDbInitialized();

  const record = normalizeRecord({
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    age: input.age,
    barber: input.barber,
    barberRating: input.barberRating,
    barberLikes: input.barberLikes,
    barberImprovements: input.barberImprovements,
    shopRating: input.shopRating,
    shopLikes: input.shopLikes,
    shopImprovements: input.shopImprovements,
    suggestion: input.suggestion,
  });

  const existing = await getAllFeedbacks();
  const updated = [record, ...existing];

  // Write atomically
  inMemoryFeedbacks = updated;
  try {
    const tempFile = `${DB_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(updated, null, 2), "utf-8");
    await fs.rename(tempFile, DB_FILE);
  } catch (err) {
    console.error("[Database] Error writing to disk:", err);
  }

  return record;
}
