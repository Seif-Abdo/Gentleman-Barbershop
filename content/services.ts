export interface ServiceItem {
  id: string;
  category: "hair" | "beard" | "package" | "treatment";
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationMinutes: number;
  priceEgp: number;
  popular?: boolean;
}

export const SERVICES: ServiceItem[] = [
  {
    id: "executive-haircut",
    category: "hair",
    titleAr: "قصة الشعر الملكية (Executive Haircut)",
    titleEn: "Executive Haircut",
    descriptionAr: "قص وتدريج احترافي حسب ملامح الوجه، غسيل مع مساج فروة الرأس، وتصفيف كامل مع سشوار بريميوم.",
    descriptionEn: "Custom precision cut or fade, hair wash with relaxing scalp massage, and executive styling.",
    durationMinutes: 40,
    priceEgp: 200,
    popular: true,
  },
  {
    id: "royal-beard-sculpt",
    category: "beard",
    titleAr: "تحديد ونحت اللحية الملكي (Royal Beard)",
    titleEn: "Royal Beard Sculpt & Trim",
    descriptionAr: "تحديد دقيق بالموس المعقم مع فوطة ساخنة معطرة بزيوت طبيعية، تهذيب وتغذية اللحية بسيروم فاخر.",
    descriptionEn: "Razor edge alignment, hot towel infusion, beard shaping, and luxury argan oil finish.",
    durationMinutes: 30,
    priceEgp: 150,
    popular: true,
  },
  {
    id: "classic-shave",
    category: "beard",
    titleAr: "حلاقة الذقن الكلاسيكية بالموس",
    titleEn: "Traditional Hot Towel Shave",
    descriptionAr: "حلاقة ناعمة بالموس الساخن، صابون رغوي إيطالي، فوطة دافئة مهدئة، وكولونيا باربرشوب فاخرة.",
    descriptionEn: "Classic straight-razor shave with Italian lather, dual hot towels, and soothing balm.",
    durationMinutes: 25,
    priceEgp: 120,
  },
  {
    id: "gentleman-vip-package",
    category: "package",
    titleAr: "باقة جنتل مان VIP الكاملة",
    titleEn: "The Gentleman VIP Experience",
    descriptionAr: "قصة شعر + تحديد لحية ملكي + جلسة بخار وتنظيف بشرة عميق + حمام كريم للشعر + سشوار وسيروم.",
    descriptionEn: "The full treatment: haircut, beard trim, deep facial steam & scrub, hair mask, and styling.",
    durationMinutes: 75,
    priceEgp: 450,
    popular: true,
  },
  {
    id: "groom-package",
    category: "package",
    titleAr: "باقة العريس الخاصة (Groom Special)",
    titleEn: "The Groom Luxury Package",
    descriptionAr: "جلسة عناية شاملة متكاملة للعرسان: صبغ أو توحيد لون اللحية، تنظيف وتقشير الوجه بالماس، تصفيف فاخر.",
    descriptionEn: "Complete grooming day for grooms including facial scrub, beard detailing, manicure, and style.",
    durationMinutes: 90,
    priceEgp: 750,
  },
  {
    id: "facial-steam-black-mask",
    category: "treatment",
    titleAr: "جلسة بخار الوجه والماسك الأسود",
    titleEn: "Facial Steam & Black Charcoal Mask",
    descriptionAr: "فتح المسام بالبخار الدافئ، إزالة الرؤوس السوداء، وماسك الفحم المنقي لترطيب ونضارة البشرة.",
    descriptionEn: "Warm ozone steam, blackhead purification, charcoal detox mask, and cold towel close.",
    durationMinutes: 30,
    priceEgp: 180,
  },
  {
    id: "hair-protein-collagen",
    category: "treatment",
    titleAr: "علاج الشعر بالبروتين والكولاجين",
    titleEn: "Protein & Keratin Hair Treatment",
    descriptionAr: "معالجة الشعر الجاف والتالف بتركيبة علاجية خالية من الفورمالين تمنح الشعر نعومة ولمعاناً طبيعياً.",
    descriptionEn: "Therapeutic hair restoration for strength, natural shine, and frizz reduction.",
    durationMinutes: 60,
    priceEgp: 500,
  },
];
