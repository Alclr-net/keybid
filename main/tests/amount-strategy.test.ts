import test from "node:test";
import assert from "node:assert/strict";

/**
 * Migration Section 3: Amount strategy verification
 * Ensures that all bids submitted to Dodo Payments are converted to the
 * smallest currency unit (cents for USD) and never left as major currency units.
 */

function calculateDodoAmount(bidAmount: number): number {
  if (!Number.isFinite(bidAmount) || !Number.isInteger(bidAmount) || bidAmount <= 0) {
    throw new Error("Bid amount must be a positive whole number");
  }
  if (bidAmount > 10_000_000) {
    throw new Error("Bid amount exceeds allowed limit");
  }
  return bidAmount * 100;
}

const ISO_COUNTRY_CODES = new Set([
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
  "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR",
  "IO", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "KY", "CF", "TD", "CL", "CN", "CX", "CC",
  "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO",
  "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA",
  "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT",
  "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP",
  "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI",
  "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX",
  "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI",
  "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN",
  "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS",
  "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS",
  "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK",
  "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "UM", "US", "UY", "UZ", "VU",
  "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW",
]);

function isValidCountryCode(country: unknown): boolean {
  if (typeof country !== "string") return false;
  return ISO_COUNTRY_CODES.has(country.trim().toUpperCase());
}

test("Dodo amount strategy converts dollars to cents correctly", () => {
  // Known inputs
  assert.equal(calculateDodoAmount(1), 100);
  assert.equal(calculateDodoAmount(10), 1000);
  assert.equal(calculateDodoAmount(50), 5000);
  assert.equal(calculateDodoAmount(250), 25000);
  assert.equal(calculateDodoAmount(500), 50000);

  // Assert unit mismatch is prevented (cents != raw dollar amount)
  const sampleBid = 25;
  const dodoAmount = calculateDodoAmount(sampleBid);
  assert.notEqual(dodoAmount, sampleBid, "Dodo amount must NOT be in major currency units");
  assert.equal(dodoAmount, sampleBid * 100, "Dodo amount must be strictly multiplied by 100");
});

test("Dodo amount bounds and type validation", () => {
  assert.throws(() => calculateDodoAmount(0), /Bid amount must be a positive whole number/);
  assert.throws(() => calculateDodoAmount(-5), /Bid amount must be a positive whole number/);
  assert.throws(() => calculateDodoAmount(10.5), /Bid amount must be a positive whole number/);
  assert.throws(() => calculateDodoAmount(10_000_001), /Bid amount exceeds allowed limit/);
});

test("Country code validation enforces ISO 3166-1 alpha-2", () => {
  assert.equal(isValidCountryCode("US"), true);
  assert.equal(isValidCountryCode("in"), true);
  assert.equal(isValidCountryCode("GB"), true);
  assert.equal(isValidCountryCode("CA"), true);

  // Invalid cases
  assert.equal(isValidCountryCode("USA"), false);
  assert.equal(isValidCountryCode(""), false);
  assert.equal(isValidCountryCode(null), false);
  assert.equal(isValidCountryCode("XX"), false);
});
