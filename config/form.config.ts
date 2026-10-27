/**
 * Gentleman Barbershop - Google Form Configuration
 * Extracted directly from live Google Form:
 * https://docs.google.com/forms/d/e/1FAIpQLSfUOJC0hmhl8POLFmm20VCk1qLJxaVJvOBx3NBPuNF1Ds7_zQ/viewform
 */

export interface GoogleFormConfig {
  formId: string;
  responseUrl: string;
  viewUrl: string;
  pageHistory: string;
  hiddenDefaults: Record<string, string>;
  barberSelectEntry: string;
  barberRatingEntries: Record<string, string>;
  ratingScaleMap: Record<number, string>;
  reverseScaleMap: Record<string, number>;
  barberFeedbackEntry: string;
  shopFeedbackEntry: string;
  suggestionEntry: string;
  shopRatingEntry: string;
  ageEntryFallback?: string;
}

export const FORM_CONFIG: GoogleFormConfig = {
  formId: "1FAIpQLSfUOJC0hmhl8POLFmm20VCk1qLJxaVJvOBx3NBPuNF1Ds7_zQ",
  responseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfUOJC0hmhl8POLFmm20VCk1qLJxaVJvOBx3NBPuNF1Ds7_zQ/formResponse",
  viewUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfUOJC0hmhl8POLFmm20VCk1qLJxaVJvOBx3NBPuNF1Ds7_zQ/viewform",
  pageHistory: "0,1",
  
  // Accidental required checkbox in Google Form that must be submitted with "الخيار رقم 1"
  hiddenDefaults: {
    "entry.1828212984": "الخيار رقم 1",
  },

  // Question: اسم حلاق المره السابقه
  barberSelectEntry: "entry.674772435",

  // Individual rating fields for each barber in the live form
  barberRatingEntries: {
    "سعيد": "entry.443324285",
    "احمد": "entry.841162587",
    "طارق": "entry.356022986",
    "محمود": "entry.1677289606",
    "محمد": "entry.42753793",
    "على": "entry.1241108488",
  },

  // 1-5 Star to Arabic qualitative text in Google Form
  ratingScaleMap: {
    5: "ممتاز",
    4: "جيد جدا",
    3: "جيد",
    2: "مقبول",
    1: "ضعيف",
  },

  reverseScaleMap: {
    "ممتاز": 5,
    "جيد جدا": 4,
    "جيد": 3,
    "مقبول": 2,
    "ضعيف": 1,
    "5": 5,
    "4": 4,
    "3": 3,
    "2": 2,
    "1": 1,
  },

  // Question: اسم الحلاق مع ذكر عيوبه أو مميزاته
  barberFeedbackEntry: "entry.1908359250",

  // Question: اذكر عيوب المحل او مميزاته
  shopFeedbackEntry: "entry.1294344828",

  // Question: أضف اقتراحك للحصول على أفضل خدمه
  suggestionEntry: "entry.1943624456",

  // Question: تقييمك للمحل ككل
  shopRatingEntry: "entry.1623033677",
};
