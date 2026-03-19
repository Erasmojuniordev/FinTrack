/**
 * Converte centavos (long do backend) para string formatada em BRL.
 * Ex: 150000 → "R$ 1.500,00"
 */
export const formatCurrency = (amountInCents: number, currency = 'BRL'): string => {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Converte decimal para centavos para enviar ao backend.
 * Ex: 1500.50 → 150050
 */
export const toCents = (amount: number): number => Math.round(amount * 100);

/**
 * Converte centavos para decimal.
 * Ex: 150050 → 1500.50
 */
export const fromCents = (cents: number): number => cents / 100;
