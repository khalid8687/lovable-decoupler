import { describe, expect, it } from 'vitest';
import { PROJECT, PHASES, PAYMENTS, WEEKS } from './project';

describe('Agreed project terms', () => {
  it('covers four consecutive implementation weeks through final handover', () => {
    expect(WEEKS.map(w => [w.number, w.start, w.end])).toEqual([[1, 1, 7], [2, 8, 14], [3, 15, 21], [4, 22, 28]]);
    expect(WEEKS.at(-1)?.end).toBe(PROJECT.deliveryDay);
  });
  it('keeps the total at 105,000 EGP', () => {
    expect(PROJECT.price).toBe(105000);
    expect(PAYMENTS.reduce((sum, p) => sum + p.amount, 0)).toBe(105000);
  });
  it('keeps payments at 30/30/30/10', () => {
    expect(PAYMENTS.map(p => p.percent)).toEqual([30, 30, 30, 10]);
    expect(PAYMENTS.map(p => p.amount)).toEqual([31500, 31500, 31500, 10500]);
  });
  it('keeps all creation and handover phases in December 2026 before December 31', () => {
    expect([PROJECT.month, PROJECT.year]).toEqual([12, 2026]);
    expect(PHASES[0].start).toBe(1);
    expect(PHASES.at(-1)?.end).toBe(PROJECT.deliveryDay);
    expect(PROJECT.deliveryDay).toBe(28);
    expect(PROJECT.deliveryDay).toBeLessThan(PROJECT.deadlineDay);
    PHASES.slice(1).forEach((phase, i) => {
      const previous = PHASES[i];
      if (!previous) throw new Error('Missing preceding phase');
      expect(phase.start).toBe(previous.end + 1);
    });
  });
});