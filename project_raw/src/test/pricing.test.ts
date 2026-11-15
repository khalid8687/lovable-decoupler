import { describe, expect, it } from 'vitest';
import { IMPLEMENTATION_PRICE, USD_EGP_RATE, WHATSAPP_RATES, egpLabel, implementationItems, smsPlans, whatsappEstimate } from '../lib/pricing';

describe('Proposal commercial rules', () => {
  it('keeps setup at EGP 15,000 with matching line items', () => {
    expect(IMPLEMENTATION_PRICE).toBe(15000);
    expect(implementationItems.reduce((sum, item) => sum + item.price, 0)).toBe(15000);
  });
  it('converts every EGP figure at the locked rate of EGP 54.35 per USD', () => {
    expect(USD_EGP_RATE).toBe(54.35);
    expect(whatsappEstimate(100, 0, 0)).toEqual({ usd: 6.44, egp: 350.01 });
    expect(whatsappEstimate(0, 100, 0)).toEqual({ usd: 0.36, egp: 19.57 });
  });
  it('prices marketing and utility unit rates at the supplied USD figures', () => {
    expect(WHATSAPP_RATES).toEqual({ marketingUsd: 0.0644, utilityUsd: 0.0036, serviceUsd: 0.0036, freeServiceConversations: 1000 });
    expect(egpLabel(WHATSAPP_RATES.marketingUsd)).toBe('3.50');
    expect(egpLabel(WHATSAPP_RATES.utilityUsd)).toBe('0.20');
  });
  it('exempts the first 1,000 service conversations per month', () => {
    expect(whatsappEstimate(0, 0, 1000)).toEqual({ usd: 0, egp: 0 });
    expect(whatsappEstimate(0, 0, 1100)).toEqual({ usd: 0.36, egp: 19.57 });
  });
  it('preserves every supplied WE bundle total', () => {
    expect(smsPlans.map(({ messages, price }) => [messages, price])).toEqual([[250, 60], [1000, 220], [3000, 615], [7000, 1300], [10000, 1760]]);
  });
});
