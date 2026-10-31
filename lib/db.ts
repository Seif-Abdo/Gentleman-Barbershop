import fs from "node:fs/promises";
import path from "node:path";
import {
  AdminUser,
  NormalizedFeedback,
  WhatsAppCampaign,
  WhatsAppSettings,
  WhatsAppTemplate,
} from "./types";
import { normalizeRecord } from "./normalize";
import { Branch, DEFAULT_BRANCHES } from "@/config/branches";
import { Barber, DEFAULT_BARBERS } from "@/config/barbers";

const DATA_DIR = path.join(process.cwd(), "data");
const FEEDBACKS_FILE = path.join(DATA_DIR, "feedbacks.json");
const BRANCHES_FILE = path.join(DATA_DIR, "branches.json");
const BARBERS_FILE = path.join(DATA_DIR, "barbers.json");
const ADMINS_FILE = path.join(DATA_DIR, "admins.json");
const CAMPAIGNS_FILE = path.join(DATA_DIR, "campaigns.json");
const WA_SETTINGS_FILE = path.join(DATA_DIR, "whatsapp_settings.json");

// Default Pre-approved WhatsApp Templates
export const DEFAULT_WA_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "tpl_vip_welcome",
    name: "VIP Welcome & 20% Discount",
    nameAr: "ترحيب ملكي وخصم 20% على الزيارة القادمة",
    category: "welcome",
    bodyAr: "أهلاً بك يا {{name}} في صالون جنتل مان! ✂️ يسعدنا تقديم خصم خاص 20% لك على باقة الحلاقة الملكية القادمة في فرع {{branch}}. استخدم كود VIP20 عند زيارتك القادمة. بانتظار تشريفك!",
    bodyEn: "Hello {{name}}! Welcome to Gentleman Barbershop ✂️ Enjoy an exclusive 20% discount on your next Royal Grooming package at our {{branch}} branch with code VIP20.",
    variables: ["{{name}}", "{{branch}}", "{{discount}}"],
  },
  {
    id: "tpl_satisfaction_recovery",
    name: "VIP Care & Service Recovery",
    nameAr: "اعتذار وجلسة عناية ملكية مجانية (للتقييمات المنخفضة)",
    category: "recovery",
    bodyAr: "مرحباً يا {{name}}، نأسف جداً إذا كانت تجربتك الأخيرة في فرع {{branch}} لم ترقَ لتوقعاتك. إدارة جنتل مان حريصة على رضاك، ويسرنا دعوتك لجلسة حلاقة وتصفيف مجانية تماماً مع كبير الحلاقين لتعويضك. يسعدنا تواصلك معنا مباشرة لتنسيق الموعد.",
    bodyEn: "Dear {{name}}, we apologize if your recent visit to our {{branch}} branch did not meet your expectations. Management invites you for a complimentary VIP grooming session with our master barber.",
    variables: ["{{name}}", "{{branch}}"],
  },
  {
    id: "tpl_weekend_offer",
    name: "Weekend Special Grooming",
    nameAr: "عرض الويك إند الخاص - باقة العناية واللحية",
    category: "promotional",
    bodyAr: "استعد لعطلة نهاية الأسبوع بأناقة تليق بك! 🌟 احجز باقة جنتل مان VIP (قص شعر + تحديد لحية + فوطة ساخنة) في فرع {{branch}} واحصل على جلسة بخار للوجه هدية مجانية. للحجز المباشر أرسل لنا رسالة الآن.",
    bodyEn: "Get weekend-ready with Gentleman Barbershop! 🌟 Book our VIP grooming package at {{branch}} and receive a complimentary facial steam treatment.",
    variables: ["{{name}}", "{{branch}}"],
  },
  {
    id: "tpl_we_miss_you",
    name: "We Miss You VIP Offer",
    nameAr: "اشتقنا لزيارتك - خصم 15% للعملاء الدائمين",
    category: "promotional",
    bodyAr: "أهلاً {{name}}، لاحظنا غيابك عنا في الفترة الماضية! ✂️ كرسي الحلاقة بانتظارك في فرع {{branch}}، ويسرنا تقديم كود خصم 15% خاص لك: BACK15. احجز موعدك اليوم لنعتني بإطلالتك.",
    bodyEn: "Hello {{name}}, we haven't seen you in a while! ✂️ Your chair is waiting at {{branch}}. Use code BACK15 for 15% off your next cut.",
    variables: ["{{name}}", "{{branch}}"],
  },
];

// Default Seed Admins
const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: "admin-master",
    username: "master",
    name: "مدير عام الصالون (Owner)",
    role: "master_admin",
    branchId: "all",
    password: "gentleman2026",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin-zahraa",
    username: "admin_zahraa",
    name: "مدير فرع زهراء المعادي",
    role: "branch_admin",
    branchId: "zahraa-maadi",
    password: "zahraa2026",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin-nasrcity",
    username: "admin_nasrcity",
    name: "مدير فرع مدينة نصر",
    role: "branch_admin",
    branchId: "nasr-city",
    password: "nasr2026",
    createdAt: new Date().toISOString(),
  },
  {
    id: "admin-newmaadi",
    username: "admin_newmaadi",
    name: "مدير فرع مدينة نصر (أبوداود الظاهري)",
    role: "branch_admin",
    branchId: "new-maadi",
    password: "maadi2026",
    createdAt: new Date().toISOString(),
  },
];

// Rich Multi-branch Seed Data
const SEED_FEEDBACKS = [
  // Zahraa El Maadi
  {
    branchId: "zahraa-maadi",
    clientName: "كريم أحمد",
    clientPhone: "+201012345678",
    age: 28,
    barber: "سعيد",
    barberRating: 5,
    barberLikes: "سعيد فنان وأسلوبه راقي جداً في القص وتحديد اللحية.",
    shopRating: 5,
    shopLikes: "المحل نظيف جداً وفخم والضيافة ممتازة.",
    suggestion: "توفير دفع بفيزا أو انستاباي.",
  },
  {
    branchId: "zahraa-maadi",
    clientName: "يوسف حسن",
    clientPhone: "+201098765432",
    age: 17,
    barber: "احمد",
    barberRating: 5,
    barberLikes: "أحسن تدريج فيد عملته، فاهم الموضة صح.",
    shopRating: 4,
    shopLikes: "ديكور شيك وموسيقى هادية.",
    suggestion: "شواحن للهواتف في صالة الانتظار.",
  },
  {
    branchId: "zahraa-maadi",
    clientName: "الحاج مصطفى",
    clientPhone: "+201122334455",
    age: 56,
    barber: "طارق",
    barberRating: 4,
    barberLikes: "حلاقة ممتازة بالموس الساخن وأدب كبير.",
    shopRating: 3,
    shopLikes: "المحل نظيف ولكن كان هناك انتظار نصف ساعة.",
    suggestion: "الالتزام بالمواعيد المسبقة لكبار السن.",
  },
  {
    branchId: "zahraa-maadi",
    clientName: "عمر فاروق",
    clientPhone: "+201234567890",
    age: 34,
    barber: "محمود",
    barberRating: 5,
    barberLikes: "باقة العريس مع محمود كانت خيالية وريحتني قبل الفرح.",
    shopRating: 5,
    shopLikes: "أفضل خدمة حلاقة في زهراء المعادي.",
    suggestion: "استمروا على هذا المستوى الرائع.",
  },

  // Nasr City
  {
    branchId: "nasr-city",
    clientName: "أحمد سراج",
    clientPhone: "+201055566677",
    age: 25,
    barber: "محمد رفاعي",
    barberRating: 5,
    barberLikes: "محمد رفاعي دقيق جداً في التدرج والقصة طلعت مضبوطة بالملي.",
    shopRating: 5,
    shopLikes: "فرع مدينة نصر تصميمه حديث ومكانه مميز في عباس العقاد.",
    suggestion: "ياريت توفروا تطبيق حجز أونلاين.",
  },
  {
    branchId: "nasr-city",
    clientName: "هيثم توفيق",
    clientPhone: "+201099887766",
    age: 31,
    barber: "وليد جمال",
    barberRating: 5,
    barberLikes: "وليد متمكن في نحت اللحية بالموس وشغله مريح جداً.",
    shopRating: 4,
    shopLikes: "كراسي مريحة وأدوات معقمة أمام العميل.",
    suggestion: "توفير قهوة لزوار الفرع.",
  },
  {
    branchId: "nasr-city",
    clientName: "حسام خليل",
    clientPhone: "+201144556677",
    age: 19,
    barber: "عمر زين",
    barberRating: 5,
    barberLikes: "عمر فنان في القصات الشبابية والمودرن.",
    shopRating: 5,
    shopLikes: "الفرع سريع ومفيش انتظار طويل.",
    suggestion: "عمل خصم للطلاب.",
  },
  {
    branchId: "nasr-city",
    clientName: "طارق عبد المنعم",
    clientPhone: "+201288990011",
    age: 48,
    barber: "محمد محمود",
    barberRating: 4,
    barberLikes: "محمد محمود مريح في التعامل وأخلاقه عالية.",
    shopRating: 4,
    shopLikes: "جلسة البخار كانت ممتازة وتستحق.",
    suggestion: "تخفيض صوت الموسيقى في المساء.",
  },
  {
    branchId: "nasr-city",
    clientName: "ماجد سامي",
    clientPhone: "+201011223344",
    age: 27,
    barber: "اسلام ماهر",
    barberRating: 2,
    barberLikes: "قصة عادية",
    barberImprovements: "كان مستعجل شوية عشان زحمة الجمعة.",
    shopRating: 3,
    shopLikes: "المكان نظيف",
    shopImprovements: "تنظيم وقت الانتظار أيام الإجازات.",
    suggestion: "زيادة عدد الكراسي في أوقات الذروة.",
  },

  // New Maadi
  {
    branchId: "new-maadi",
    clientName: "شريف النجار",
    clientPhone: "+201077665544",
    age: 36,
    barber: "احمد سيد",
    barberRating: 5,
    barberLikes: "أحمد سيد أستاذ في المقص الكلاسيكي، راحة نفسية وشغل عالي.",
    shopRating: 5,
    shopLikes: "فرع المعادي الجديدة هادئ جداً وفخم ونظيف للغاية.",
    suggestion: "توفير مساحات انتظار خارجية.",
  },
  {
    branchId: "new-maadi",
    clientName: "ياسر رضوان",
    clientPhone: "+201199887755",
    age: 51,
    barber: "خالد سيد",
    barberRating: 5,
    barberLikes: "خالد إيده خفيفة جداً في حلاقة الذقن بالفوط الساخنة.",
    shopRating: 5,
    shopLikes: "التعقيم في الفرع على أعلى مستوى عالمي.",
    suggestion: "كل شيء ممتاز ربنا يوفقكم.",
  },
  {
    branchId: "new-maadi",
    clientName: "زياد الشريف",
    clientPhone: "+201211335577",
    age: 22,
    barber: "عبدالله",
    barberRating: 5,
    barberLikes: "عبدالله فنان في جلسات تنظيف البشرة وتحديد الذقن.",
    shopRating: 5,
    shopLikes: "ديكور الأسود والذهب في الفرع يفتح النفس.",
    suggestion: "توفير باقات اشتراك شهرية.",
  },
];

// Initialize and ensure data files exist
async function ensureDbInitialized(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  // 1. Branches
  try {
    await fs.access(BRANCHES_FILE);
  } catch {
    await fs.writeFile(BRANCHES_FILE, JSON.stringify(DEFAULT_BRANCHES, null, 2), "utf-8");
  }

  // 2. Barbers
  try {
    await fs.access(BARBERS_FILE);
  } catch {
    await fs.writeFile(BARBERS_FILE, JSON.stringify(DEFAULT_BARBERS, null, 2), "utf-8");
  }

  // 3. Admins
  try {
    await fs.access(ADMINS_FILE);
  } catch {
    await fs.writeFile(ADMINS_FILE, JSON.stringify(DEFAULT_ADMINS, null, 2), "utf-8");
  }

  // 4. WhatsApp Settings
  try {
    await fs.access(WA_SETTINGS_FILE);
  } catch {
    const defaultSettings: WhatsAppSettings = {
      phoneNumberId: "",
      wabaId: "",
      accessToken: "",
      testRecipientNumber: "+201001234567",
      isEnabled: false,
    };
    await fs.writeFile(WA_SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), "utf-8");
  }

  // 5. Campaigns
  try {
    await fs.access(CAMPAIGNS_FILE);
  } catch {
    const defaultCampaigns: WhatsAppCampaign[] = [
      {
        id: "camp-1",
        name: "حملة الترحيب وكوبون VIP20",
        templateId: "tpl_vip_welcome",
        targetFilter: {
          branchId: "all",
          ageGroup: "all",
          sentiment: "all",
        },
        audienceCount: 12,
        status: "sent",
        sentAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ];
    await fs.writeFile(CAMPAIGNS_FILE, JSON.stringify(defaultCampaigns, null, 2), "utf-8");
  }

  // 6. Feedbacks
  try {
    await fs.access(FEEDBACKS_FILE);
  } catch {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const initial: NormalizedFeedback[] = SEED_FEEDBACKS.map((seed, idx) => {
      const daysAgo = idx % 25;
      const time = new Date(now - daysAgo * dayMs - idx * 100000).toISOString();
      return normalizeRecord({
        id: `seed-${idx + 1}`,
        timestamp: time,
        branchId: seed.branchId,
        clientName: seed.clientName,
        clientPhone: seed.clientPhone,
        age: seed.age,
        barber: seed.barber,
        barberRating: seed.barberRating,
        barberLikes: seed.barberLikes,
        shopRating: seed.shopRating,
        shopLikes: seed.shopLikes,
        suggestion: seed.suggestion,
      });
    });
    await fs.writeFile(FEEDBACKS_FILE, JSON.stringify(initial, null, 2), "utf-8");
  }
}

// ================= BRANCHES =================
export async function getAllBranches(): Promise<Branch[]> {
  await ensureDbInitialized();
  try {
    const raw = await fs.readFile(BRANCHES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BRANCHES;
  }
}

export async function saveBranches(branches: Branch[]): Promise<void> {
  await ensureDbInitialized();
  await fs.writeFile(BRANCHES_FILE, JSON.stringify(branches, null, 2), "utf-8");
}

export async function getBranchById(id: string): Promise<Branch | null> {
  const branches = await getAllBranches();
  return branches.find((b) => b.id === id) || null;
}

// ================= BARBERS =================
export async function getAllBarbers(): Promise<Barber[]> {
  await ensureDbInitialized();
  try {
    const raw = await fs.readFile(BARBERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_BARBERS;
  }
}

export async function saveBarbers(barbers: Barber[]): Promise<void> {
  await ensureDbInitialized();
  await fs.writeFile(BARBERS_FILE, JSON.stringify(barbers, null, 2), "utf-8");
}

export async function getBarbersForBranch(branchId: string): Promise<Barber[]> {
  const barbers = await getAllBarbers();
  return barbers.filter((b) => b.branchId === branchId && b.isActive);
}

// ================= FEEDBACKS =================
export async function getAllFeedbacks(): Promise<NormalizedFeedback[]> {
  await ensureDbInitialized();
  try {
    const raw = await fs.readFile(FEEDBACKS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function insertFeedback(input: {
  branchId?: string;
  clientName?: string;
  clientPhone?: string;
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
    branchId: input.branchId || "zahraa-maadi",
    clientName: input.clientName,
    clientPhone: input.clientPhone,
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

  try {
    const tempFile = `${FEEDBACKS_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(updated, null, 2), "utf-8");
    await fs.rename(tempFile, FEEDBACKS_FILE);
  } catch (err) {
    console.error("[Database] Error writing feedback to disk:", err);
  }

  return record;
}

// ================= ADMINS =================
export async function getAllAdmins(): Promise<AdminUser[]> {
  await ensureDbInitialized();
  try {
    const raw = await fs.readFile(ADMINS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ADMINS;
  }
}

export async function saveAdmins(admins: AdminUser[]): Promise<void> {
  await ensureDbInitialized();
  await fs.writeFile(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf-8");
}

export async function verifyAdminCredentials(
  username: string,
  pass: string
): Promise<AdminUser | null> {
  const admins = await getAllAdmins();
  const user = admins.find(
    (a) => a.username.toLowerCase() === username.toLowerCase().trim() && a.password === pass
  );
  return user || null;
}

// ================= WHATSAPP CAMPAIGNS & SETTINGS =================
export async function getWhatsAppSettings(): Promise<WhatsAppSettings> {
  await ensureDbInitialized();
  try {
    const raw = await fs.readFile(WA_SETTINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {
      phoneNumberId: "",
      wabaId: "",
      accessToken: "",
      testRecipientNumber: "",
      isEnabled: false,
    };
  }
}

export async function saveWhatsAppSettings(settings: WhatsAppSettings): Promise<void> {
  await ensureDbInitialized();
  await fs.writeFile(WA_SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

export async function getAllCampaigns(): Promise<WhatsAppCampaign[]> {
  await ensureDbInitialized();
  try {
    const raw = await fs.readFile(CAMPAIGNS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveCampaigns(campaigns: WhatsAppCampaign[]): Promise<void> {
  await ensureDbInitialized();
  await fs.writeFile(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2), "utf-8");
}
