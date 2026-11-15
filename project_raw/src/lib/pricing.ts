export const IMPLEMENTATION_PRICE = 15000;
export const implementationItems = [
  { name: 'Platform foundation', detail: 'Dashboard, accounts & campaign management', price: 3500 },
  { name: 'Messaging integrations', detail: 'WhatsApp & WE Business SMS connections', price: 5000 },
  { name: 'Audience & automation', detail: 'CSV audiences, targeting & bot workflows', price: 4000 },
  { name: 'Launch & handover', detail: 'Testing, deployment & team walkthrough', price: 2500 },
];
export const smsPlans = [
  { messages: 250, price: 60, rate: '24.0' },
  { messages: 1000, price: 220, rate: '22.0' },
  { messages: 3000, price: 615, rate: '20.5' },
  { messages: 7000, price: 1300, rate: '18.6' },
  { messages: 10000, price: 1760, rate: '17.6' },
] as const;

/** Locked USD to EGP conversion rate used for every EGP figure in this proposal. */
export const USD_EGP_RATE = 54.35;

export const WHATSAPP_RATES = {
  marketingUsd: 0.0644,
  utilityUsd: 0.0036,
  serviceUsd: 0.0036,
  freeServiceConversations: 1000,
} as const;

export function whatsappEstimate(marketing: number, utility: number, service: number) {
  const usd = marketing * WHATSAPP_RATES.marketingUsd
    + utility * WHATSAPP_RATES.utilityUsd
    + Math.max(0, service - WHATSAPP_RATES.freeServiceConversations) * WHATSAPP_RATES.serviceUsd;
  return {
    usd: Number(usd.toFixed(4)),
    egp: Number((usd * USD_EGP_RATE).toFixed(2)),
  };
}

/** Fixed 2-decimal EGP label for a USD unit rate, e.g. "3.50". */
export const egpLabel = (usd: number) => (usd * USD_EGP_RATE).toFixed(2);
