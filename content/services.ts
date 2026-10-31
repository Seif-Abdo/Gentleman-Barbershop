export interface ServiceItem {
  id: string;
  category: "hair" | "beard" | "package" | "treatment" | "styling";
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationMinutes?: number;
  priceEgp: number;
  priceTextAr?: string;
  priceTextEn?: string;
  popular?: boolean;
}

export const ZAHRAA_SERVICES: ServiceItem[] = [
  {
    id: "zahraa-haircut-beard",
    category: "package",
    titleAr: "حلاقة الشعر والدقن",
    titleEn: "Haircut & Beard",
    descriptionAr: "قص وتصفيف الشعر باحترافية مع تحديد وتنسيق اللحية بالموس والفوطة المهدئة.",
    descriptionEn: "Professional haircut and styling combined with precise beard trimming and razor finish.",
    durationMinutes: 45,
    priceEgp: 95,
    popular: true,
  },
  {
    id: "zahraa-haircut",
    category: "hair",
    titleAr: "الشعر",
    titleEn: "Haircut",
    descriptionAr: "قصة شعر متقنة تناسب شكل الوجه مع غسيل خفيف وتصفيف.",
    descriptionEn: "Classic or modern haircut tailored to facial structure with styling.",
    durationMinutes: 30,
    priceEgp: 70,
    popular: true,
  },
  {
    id: "zahraa-beard",
    category: "beard",
    titleAr: "الدقن",
    titleEn: "Beard Trim & Shave",
    descriptionAr: "تحديد دقيق للحية بالموس وتهذيب الحواف والأطراف وكولونيا منعشة.",
    descriptionEn: "Precision beard shaping, edge trimming, and straight-razor detailing.",
    durationMinutes: 20,
    priceEgp: 50,
    popular: true,
  },
  {
    id: "zahraa-blowdry",
    category: "styling",
    titleAr: "الاستشوار",
    titleEn: "Blow Dry & Styling",
    descriptionAr: "تصفيف الشعر بالحرارة وسشوار بريميوم مع تثبيت بمثبت شعر فاخر.",
    descriptionEn: "Premium blow-dry and heat styling with executive hold product.",
    durationMinutes: 20,
    priceEgp: 50,
  },
  {
    id: "zahraa-wavy",
    category: "styling",
    titleAr: "الويفى",
    titleEn: "Wavy Hair Styling",
    descriptionAr: "عمل تموجات ويفي طبيعية للشعر لإطلالة شبابية جذابة وعصرية.",
    descriptionEn: "Natural wavy texture and effortless modern volume styling.",
    durationMinutes: 20,
    priceEgp: 35,
  },
  {
    id: "zahraa-towel",
    category: "treatment",
    titleAr: "الفوطة السخنة والباردة",
    titleEn: "Hot & Cold Towel",
    descriptionAr: "جلسة انتعاش مزدوجة بفوطة ساخنة لفتح المسام يعقبها فوطة باردة معطرة لتهدئة البشرة.",
    descriptionEn: "Refreshing dual-temperature towel service for skin rejuvenation and total relaxation.",
    durationMinutes: 15,
    priceEgp: 35,
  },
];

export const NASR_CITY_SERVICES: ServiceItem[] = [
  {
    id: "nasr-haircut-beard",
    category: "package",
    titleAr: "شعر و دقن",
    titleEn: "Haircut & Beard",
    descriptionAr: "الباقة الكاملة: قصة شعر متقنة وتحديد لحية ملكي بالموس والفوطة الدافئة.",
    descriptionEn: "Full signature combo: precision haircut and luxury beard sculpt.",
    durationMinutes: 45,
    priceEgp: 250,
    popular: true,
  },
  {
    id: "nasr-haircut",
    category: "hair",
    titleAr: "شعر",
    titleEn: "Haircut",
    descriptionAr: "قص وتدريج فيد احترافي بأحدث القصات العالمية مع غسيل وتصفيف.",
    descriptionEn: "Precision haircut and custom fade styling tailored to perfection.",
    durationMinutes: 30,
    priceEgp: 150,
    popular: true,
  },
  {
    id: "nasr-beard",
    category: "beard",
    titleAr: "دقن",
    titleEn: "Beard Trim & Styling",
    descriptionAr: "تحديد ونحت اللحية بالموس المعقم مع زيوت ترطيب وتغذية طبيعية.",
    descriptionEn: "Beard shaping, razor line-up, and nourishing beard oil finish.",
    durationMinutes: 20,
    priceEgp: 100,
  },
  {
    id: "nasr-facial-7stages",
    category: "treatment",
    titleAr: "تنظيف بشرة 7 مراحل",
    titleEn: "7-Step Deep Facial Detox",
    descriptionAr: "جلسة عناية شاملة بـ 7 مراحل: تقشير، بخار أوزون، شفط دهون ورؤوس سوداء، ماسك منقي، وتغذية سيروم.",
    descriptionEn: "Comprehensive 7-phase skin treatment: exfoliation, steam, blackhead vacuum, mask & serum.",
    durationMinutes: 45,
    priceEgp: 300,
    popular: true,
  },
  {
    id: "nasr-facial-steam",
    category: "treatment",
    titleAr: "تنظيف بشرة بخار",
    titleEn: "Steam Facial Cleansing",
    descriptionAr: "جلسة بخار أوزون دافئ لفتح المسام وإزالة الشوائب وترطيب البشرة.",
    descriptionEn: "Warm ozone steam treatment to open pores and deeply purify skin.",
    durationMinutes: 25,
    priceEgp: 100,
  },
  {
    id: "nasr-blowdry",
    category: "styling",
    titleAr: "استشوار",
    titleEn: "Blow Dry & Styling",
    descriptionAr: "سشوار احترافي عالي الحرارة وتصفيف دقيق يمنح الشعر مظهراً أنيقاً وثابتاً.",
    descriptionEn: "Professional heat blow-dry and executive sculpted styling.",
    durationMinutes: 20,
    priceEgp: 100,
  },
  {
    id: "nasr-curly",
    category: "styling",
    titleAr: "كيرلى",
    titleEn: "Curly Hair Styling",
    descriptionAr: "تحديد خصلات الكيرلي بمنتجات احترافية تمنح الشعر تموجات واضحة وحيوية ولمعاناً.",
    descriptionEn: "Curl definition and volume styling with premium curl creams.",
    durationMinutes: 25,
    priceEgp: 50,
  },
  {
    id: "nasr-coloring",
    category: "treatment",
    titleAr: "الصبغات (على حسب الطلب)",
    titleEn: "Hair & Beard Coloring",
    descriptionAr: "صبغ وتوحيد لون الشعر أو اللحية بأفضل الصبغات العالمية الخالية من الأمونيا حسب اختيارك.",
    descriptionEn: "Custom hair and beard color treatments using premium ammonia-free formulas.",
    durationMinutes: 40,
    priceEgp: 0,
    priceTextAr: "على حسب الطلب",
    priceTextEn: "Upon Request",
  },
];

export const BRANCH_SERVICES_MAP: Record<string, ServiceItem[]> = {
  "zahraa-maadi": ZAHRAA_SERVICES,
  "nasr-city": NASR_CITY_SERVICES,
  "new-maadi": NASR_CITY_SERVICES, // Nasr City (Abou Dawoud El Zahery) has the same updated services list
};

export function getServicesForBranch(branchId: string): ServiceItem[] {
  return BRANCH_SERVICES_MAP[branchId] || ZAHRAA_SERVICES;
}

// Fallback legacy export
export const SERVICES: ServiceItem[] = ZAHRAA_SERVICES;
