import { test } from 'node:test';
import assert from 'node:assert';

const reverseScaleMap = {
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

function parseRating(val) {
  if (typeof val === "number" && val >= 1 && val <= 5) return val;
  const str = String(val || "").trim();
  if (reverseScaleMap[str]) {
    return reverseScaleMap[str];
  }
  const parsed = parseInt(str, 10);
  if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) return parsed;
  return 3;
}

test('Rating Parsing - Arabic qualitative text to 1-5 score', () => {
  assert.strictEqual(parseRating('ممتاز'), 5);
  assert.strictEqual(parseRating('جيد جدا'), 4);
  assert.strictEqual(parseRating('جيد'), 3);
  assert.strictEqual(parseRating('مقبول'), 2);
  assert.strictEqual(parseRating('ضعيف'), 1);
});

test('Rating Parsing - Numeric values', () => {
  assert.strictEqual(parseRating(5), 5);
  assert.strictEqual(parseRating('4'), 4);
  assert.strictEqual(parseRating(null), 3); // safe fallback
});
