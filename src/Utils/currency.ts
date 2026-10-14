export const formatMoney = (
  value: number | string,
  currency: string,
  maximumFractionDigits = 2,
) =>
  `${Number(value).toLocaleString('en-US', { maximumFractionDigits })} ${currency}`;

export const formatCurrencyTotals = (
  totals: Record<string, number>,
  emptyValue = '0',
) => {
  const entries = Object.entries(totals);
  if (entries.length === 0) return emptyValue;

  return entries
    .map(([currency, total]) => formatMoney(total, currency))
    .join(' • ');
};
