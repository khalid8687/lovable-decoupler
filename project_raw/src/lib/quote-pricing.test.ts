import { describe, test } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { phonePricing, calculateItem } from "./quote-pricing";

describe("requested final phone pricing", () => {
  test("8841: one phone at 3500 after 7.5% discount", () => {
    const p = calculateItem(phonePricing.p8841);
    deepStrictEqual([p.qty, p.discount, p.netUnit, p.line], [1, 7.5, 3500, 3500]);
  });
  test("7841: two phones at 1800 after 7.5% discount", () => {
    const p = calculateItem(phonePricing.p7841);
    deepStrictEqual([p.qty, p.discount, p.netUnit, p.line], [2, 7.5, 1800, 3600]);
  });
  test("6921: eleven phones at 1100 after 7.5% discount", () => {
    const p = calculateItem(phonePricing.p6921);
    deepStrictEqual([p.qty, p.discount, p.netUnit, p.line], [11, 7.5, 1100, 12100]);
  });
  test("unchanged equipment discounts and no VAT yield 56010", () => {
    const rows = [
      { qty: 1, price: 7800, discount: 10 }, { qty: 1, price: 6600, discount: 10 },
      { qty: 2, price: 2500, discount: 5 }, { qty: 1, price: 6100 },
      { qty: 1, price: 14000, flatDiscount: 1000 }, ...Object.values(phonePricing),
    ];
    strictEqual(rows.map(calculateItem).reduce((sum, p) => sum + p.line, 0), 56010);
  });
});