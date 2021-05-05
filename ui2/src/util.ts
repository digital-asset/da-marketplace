export function formatCurrency(amount: string | number, currency = 'USD', locale = 'en-US') {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  const value = typeof amount === 'string' ? Number(amount) : amount;

  return formatter.format(value);
}
