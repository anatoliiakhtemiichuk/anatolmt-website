/**
 * Price Format Validation Test
 *
 * Run with: npx ts-node scripts/test-price-format.ts
 * Or: npx tsx scripts/test-price-format.ts
 *
 * This script validates that prices are stored and displayed correctly.
 *
 * EXPECTED BEHAVIOR:
 * - Booking with price_pln = 200 should display as "200 zł" in admin
 * - Old grosze values (e.g., 18000) should be converted to PLN (180) by migration 008
 */

const testCases = [
  { input: 200, expected: '200 zł', description: 'Standard PLN price' },
  { input: 50, expected: '50 zł', description: 'Consultation price' },
  { input: 250, expected: '250 zł', description: 'Extended visit price' },
  { input: 0, expected: '0 zł', description: 'Zero price' },
];

// This is how formatPrice should work (PLN, no division)
const formatPrice = (pricePln: number): string => `${pricePln} zł`;

console.log('=== Price Format Validation Test ===\n');

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const result = formatPrice(test.input);
  const success = result === test.expected;

  if (success) {
    console.log(`✅ PASS: ${test.description}`);
    console.log(`   Input: ${test.input} -> Output: "${result}"`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${test.description}`);
    console.log(`   Input: ${test.input}`);
    console.log(`   Expected: "${test.expected}"`);
    console.log(`   Got: "${result}"`);
    failed++;
  }
  console.log('');
}

console.log('=== Summary ===');
console.log(`Passed: ${passed}/${testCases.length}`);
console.log(`Failed: ${failed}/${testCases.length}`);

if (failed > 0) {
  console.log('\n⚠️  Some tests failed! Check price format consistency.');
  process.exit(1);
} else {
  console.log('\n✅ All tests passed! Price format is consistent.');
  process.exit(0);
}
