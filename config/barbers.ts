export interface Barber {
  id: string;
  branchId: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  experienceYears: number;
  specialtyAr: string;
  specialtyEn: string;
  avatar?: string;
  isActive: boolean;
}

export const DEFAULT_BARBERS: Barber[] = [
  // --- Branch 1: Zahraa El Maadi ---
  {
    id: "saeed",
    branchId: "zahraa-maadi",
    nameAr: "سعيد",
    nameEn: "Saeed",
    titleAr: "كبير الحلاقين (Master Barber)",
    titleEn: "Master Barber",
    experienceYears: 12,
    specialtyAr: "القصات الكلاسيكية وتحديد اللحية الملكي",
    specialtyEn: "Classic cuts & Royal beard styling",
    isActive: true,
  },
  {
    id: "ahmed",
    branchId: "zahraa-maadi",
    nameAr: "أحمد",
    nameEn: "Ahmed",
    titleAr: "خبير التصفيف الحديث",
    titleEn: "Modern Fade Stylist",
    experienceYears: 8,
    specialtyAr: "تدريج الفيد المعاصر والسيشوار الاحترافي",
    specialtyEn: "Skin fade & styling",
    isActive: true,
  },
  {
    id: "tarek",
    branchId: "zahraa-maadi",
    nameAr: "طارق",
    nameEn: "Tarek",
    titleAr: "أخصائي العناية بالبشرة واللحية",
    titleEn: "Beard & Grooming Specialist",
    experienceYears: 9,
    specialtyAr: "الحلاقة بالموس الساخن وجلسات البخار",
    specialtyEn: "Hot towel shave & facial care",
    isActive: true,
  },
  {
    id: "mohamed",
    branchId: "zahraa-maadi",
    nameAr: "محمد",
    nameEn: "Mohamed",
    titleAr: "فنان التدرجات والقصات الشبابية",
    titleEn: "Youth & Trend Barber",
    experienceYears: 7,
    specialtyAr: "تصاميم الخطوط وتدرجات التيمبر",
    specialtyEn: "Razor designs & taper fades",
    isActive: true,
  },
  {
    id: "ali",
    branchId: "zahraa-maadi",
    nameAr: "علي",
    nameEn: "Ali",
    titleAr: "خبير القص والتلوين",
    titleEn: "Precision Cut & Color",
    experienceYears: 10,
    specialtyAr: "صبغة اللحية الدقيقة ومعالجة الشعر",
    specialtyEn: "Beard coloring & hair treatments",
    isActive: true,
  },
  {
    id: "mahmoud",
    branchId: "zahraa-maadi",
    nameAr: "محمود",
    nameEn: "Mahmoud",
    titleAr: "مصفف بريميوم ورعاية VIP",
    titleEn: "VIP Grooming Specialist",
    experienceYears: 11,
    specialtyAr: "الباقات الشاملة والعناية بالعرسان",
    specialtyEn: "Complete packages & Groom prep",
    isActive: true,
  },

  // --- Branch 2: Nasr City ---
  {
    id: "mohamed-refaie",
    branchId: "nasr-city",
    nameAr: "محمد رفاعي",
    nameEn: "Mohamed Refaie",
    titleAr: "كبير مصففي فرع مدينة نصر",
    titleEn: "Head Stylist - Nasr City",
    experienceYears: 11,
    specialtyAr: "تدريج الفيد الإيطالي والقصات الكلاسيكية",
    specialtyEn: "Italian Skin Fade & Classic Grooming",
    isActive: true,
  },
  {
    id: "walid-gamal",
    branchId: "nasr-city",
    nameAr: "وليد جمال",
    nameEn: "Walid Gamal",
    titleAr: "أخصائي نحت وتحديد اللحية",
    titleEn: "Beard Sculpting Artist",
    experienceYears: 9,
    specialtyAr: "تحديد اللحية بالموس ورسم الخطوط",
    specialtyEn: "Razor beard shaping & line work",
    isActive: true,
  },
  {
    id: "omar-zein",
    branchId: "nasr-city",
    nameAr: "عمر زين",
    nameEn: "Omar Zein",
    titleAr: "خبير القصات العصرية",
    titleEn: "Modern Trend Specialist",
    experienceYears: 8,
    specialtyAr: "الاستايلات الشبابية والسيشوار الاحترافي",
    specialtyEn: "Modern youth cuts & textured styling",
    isActive: true,
  },
  {
    id: "mohamed-mahmoud",
    branchId: "nasr-city",
    nameAr: "محمد محمود",
    nameEn: "Mohamed Mahmoud",
    titleAr: "خبير العناية والعلاجات الطبيعية",
    titleEn: "Treatment & Facial Expert",
    experienceYears: 10,
    specialtyAr: "جلسات حمام البخار والعناية بالشعر",
    specialtyEn: "Ozone facial steam & keratin masks",
    isActive: true,
  },
  {
    id: "islam-maher",
    branchId: "nasr-city",
    nameAr: "اسلام ماهر",
    nameEn: "Islam Maher",
    titleAr: "مصفف VIP المتميز",
    titleEn: "Executive VIP Groomer",
    experienceYears: 8,
    specialtyAr: "باقات العرسان الكاملة والتجهيز الملكي",
    specialtyEn: "Full groom packages & executive styling",
    isActive: true,
  },

  // --- Branch 3: Nasr City (Abou Dawoud El Zahery) ---
  {
    id: "ahmed-sayed",
    branchId: "new-maadi",
    nameAr: "احمد سيد",
    nameEn: "Ahmed Sayed",
    titleAr: "كبير حلاقي فرع مدينة نصر (أبوداود الظاهري)",
    titleEn: "Lead Barber - Nasr City (Abou Dawoud)",
    experienceYears: 10,
    specialtyAr: "القصات الدقيقة والتصميم الكلاسيكي الفاخر",
    specialtyEn: "Precision scissor cut & luxury styling",
    isActive: true,
  },
  {
    id: "khaled-sayed",
    branchId: "new-maadi",
    nameAr: "خالد سيد",
    nameEn: "Khaled Sayed",
    titleAr: "خبير تدريج الفيد والموس الساخن",
    titleEn: "Fade Master & Hot Shave",
    experienceYears: 9,
    specialtyAr: "التدريج المعاصر وحلاقة الذقن بالفوط الساخنة",
    specialtyEn: "Taper fades & hot towel shave",
    isActive: true,
  },
  {
    id: "abdullah",
    branchId: "new-maadi",
    nameAr: "عبدالله",
    nameEn: "Abdullah",
    titleAr: "أخصائي التصفيف والعناية بالبشرة",
    titleEn: "Styling & Facial Care",
    experienceYears: 7,
    specialtyAr: "تنظيف البشرة العميق وتحديد اللحية الملكي",
    specialtyEn: "Deep skin detox & royal beard sculpt",
    isActive: true,
  },
];

// Helper to filter barbers by branch
export function getBarbersByBranch(branchId: string, barbers: Barber[] = DEFAULT_BARBERS): Barber[] {
  return barbers.filter((b) => b.branchId === branchId && b.isActive);
}
