export interface Barber {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  experienceYears: number;
  specialtyAr: string;
  specialtyEn: string;
  avatar: string;
}

export const BARBERS: Barber[] = [
  {
    id: "سعيد",
    nameAr: "سعيد",
    nameEn: "Saeed",
    titleAr: "كبير الحلاقين (Master Barber)",
    titleEn: "Master Barber",
    experienceYears: 12,
    specialtyAr: "القصات الكلاسيكية وتحديد اللحية الملكي",
    specialtyEn: "Classic cuts & Royal beard styling",
    avatar: "/barbers/saeed.jpg",
  },
  {
    id: "احمد",
    nameAr: "أحمد",
    nameEn: "Ahmed",
    titleAr: "خبير التصفيف الحديث",
    titleEn: "Modern Fade Stylist",
    experienceYears: 8,
    specialtyAr: "تدريج الفيد المعاصر والسيشوار الاحترافي",
    specialtyEn: "Skin fade & styling",
    avatar: "/barbers/ahmed.jpg",
  },
  {
    id: "طارق",
    nameAr: "طارق",
    nameEn: "Tarek",
    titleAr: "أخصائي العناية بالبشرة واللحية",
    titleEn: "Beard & Grooming Specialist",
    experienceYears: 9,
    specialtyAr: "الحلاقة بالموس الساخن وجلسات البخار",
    specialtyEn: "Hot towel shave & facial care",
    avatar: "/barbers/tarek.jpg",
  },
  {
    id: "محمد",
    nameAr: "محمد",
    nameEn: "Mohamed",
    titleAr: "فنان التدرجات والقصات الشبابية",
    titleEn: "Youth & Trend Barber",
    experienceYears: 7,
    specialtyAr: "تصاميم الخطوط وتدرجات التيمبر",
    specialtyEn: "Razor designs & taper fades",
    avatar: "/barbers/mohamed.jpg",
  },
  {
    id: "على",
    nameAr: "علي",
    nameEn: "Ali",
    titleAr: "خبير القص والتلوين",
    titleEn: "Precision Cut & Color",
    experienceYears: 10,
    specialtyAr: "صبغة اللحية الدقيقة ومعالجة الشعر",
    specialtyEn: "Beard coloring & hair treatments",
    avatar: "/barbers/ali.jpg",
  },
  {
    id: "محمود",
    nameAr: "محمود",
    nameEn: "Mahmoud",
    titleAr: "مصفف بريميوم ورعاية VIP",
    titleEn: "VIP Grooming Specialist",
    experienceYears: 11,
    specialtyAr: "الباقات الشاملة والعناية بالعرسان",
    specialtyEn: "Complete packages & Groom prep",
    avatar: "/barbers/mahmoud.jpg",
  },
];

export const BARBER_NAMES = BARBERS.map((b) => b.id);
