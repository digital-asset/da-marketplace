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

// Normalize a url with duplicate path separators like
// `https://something.com:7777/a//b/c////d/e/f` into
// `https://something.com:7777/a/b/c/d/e/f
export function safeUrlPath(url: string): string {
  const u = new URL(url);
  return `${u.origin}/${u.pathname
    .split('/')
    .filter(x => !!x)
    .join('/')}${u.search}`;
}
