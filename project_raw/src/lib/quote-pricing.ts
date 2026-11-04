// Final phone prices are authoritative; derive the undiscounted reference price.
function phone(qty: number, finalUnitPrice: number) {
  const discount = 7.5;
  return { qty, finalUnitPrice, discount, price: Math.round(finalUnitPrice / (1 - discount / 100) * 100) / 100 };
}

export const phonePricing = {
  p8841: phone(1, 3500),
  p7841: phone(2, 1800),
  p6921: phone(11, 1100),
};

export function calculateItem<T extends { qty: number; price: number; discount?: number; flatDiscount?: number; finalUnitPrice?: number }>(p: T) {
  const gross = Math.round(p.qty * p.price * 100) / 100;
  const discountAmt = p.finalUnitPrice === undefined
    ? Math.round(gross * (p.discount || 0) / 100) + (p.flatDiscount || 0)
    : Math.round((gross - p.qty * p.finalUnitPrice) * 100) / 100;
  const line = p.finalUnitPrice === undefined ? Math.round((gross - discountAmt) * 100) / 100 : p.qty * p.finalUnitPrice;
  return { ...p, gross, discountAmt, line, netUnit: line / p.qty };
}