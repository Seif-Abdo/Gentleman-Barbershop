/**
 * Gentleman Barbershop - Native Feedback Form Configuration
 * No external Google Form dependency.
 */

export interface FormQuestionConfig {
  id: string;
  labelAr: string;
  labelEn: string;
  placeholderAr?: string;
  placeholderEn?: string;
  required?: boolean;
}

export const FORM_RATING_SCALES: Record<number, string> = {
  5: "ممتاز",
  4: "جيد جدا",
  3: "جيد",
  2: "مقبول",
  1: "ضعيف",
};

export const REVERSE_RATING_SCALES: Record<string, number> = {
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
};

export const FORM_CONFIG = {
  minAge: 5,
  maxAge: 100,
  ratingScaleMap: FORM_RATING_SCALES,
  reverseScaleMap: REVERSE_RATING_SCALES,
};
