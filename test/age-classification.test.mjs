import { test } from 'node:test';
import assert from 'node:assert';

// Import our classifier logic
function classifyAge(age) {
  if (age === null || age === undefined || age === "") return "unknown";
  const num = typeof age === "number" ? age : parseInt(String(age).trim(), 10);
  if (isNaN(num) || num < 1 || num > 120) return "unknown";

  if (num <= 17) return "young";
  if (num <= 44) return "youths";
  return "elderly";
}

test('Age Classification - Boundary: Young (<= 17)', () => {
  assert.strictEqual(classifyAge(5), 'young');
  assert.strictEqual(classifyAge(16), 'young');
  assert.strictEqual(classifyAge(17), 'young');
});

test('Age Classification - Boundary: Youths (18 to 44)', () => {
  assert.strictEqual(classifyAge(18), 'youths');
  assert.strictEqual(classifyAge(25), 'youths');
  assert.strictEqual(classifyAge(44), 'youths');
});

test('Age Classification - Boundary: Elderly (>= 45)', () => {
  assert.strictEqual(classifyAge(45), 'elderly');
  assert.strictEqual(classifyAge(60), 'elderly');
  assert.strictEqual(classifyAge(85), 'elderly');
});

test('Age Classification - Invalid / Missing -> Unknown', () => {
  assert.strictEqual(classifyAge(null), 'unknown');
  assert.strictEqual(classifyAge(undefined), 'unknown');
  assert.strictEqual(classifyAge(''), 'unknown');
  assert.strictEqual(classifyAge('abc'), 'unknown');
  assert.strictEqual(classifyAge(-5), 'unknown');
  assert.strictEqual(classifyAge(150), 'unknown');
});
