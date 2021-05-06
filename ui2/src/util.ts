export function formatCurrency(amount: string | number, currency = 'USD', locale = 'en-US') {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });

  const value = typeof amount === 'string' ? Number(amount) : amount;

  return formatter.format(value);
}

type PreciseInputSteps = {
  step: string;
  placeholder: string;
};

export function preciseInputSteps(precision: number): PreciseInputSteps {
  const step = precision > 0 ? `0.${'0'.repeat(precision - 1)}1` : '1';

  const placeholder = precision > 0 ? `0.${'0'.repeat(precision)}` : '0';

  return { step, placeholder };
}
