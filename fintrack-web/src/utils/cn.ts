import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina classes CSS com suporte a condicionais (clsx) e resolve conflitos do Tailwind (twMerge).
 * Uso: cn('base-class', condition && 'conditional-class', 'override-class')
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
