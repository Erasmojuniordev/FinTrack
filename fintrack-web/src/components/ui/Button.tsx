import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

/**
 * Componente de botão reutilizável com variantes visuais, tamanhos e estado de loading.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)]/50 shadow-lg shadow-[var(--color-primary)]/20 active:scale-[0.98]',
      secondary:
        'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] focus:ring-[var(--color-primary)]/30',
      ghost:
        'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] focus:ring-[var(--color-primary)]/30',
      danger:
        'bg-[var(--color-danger)] text-white hover:opacity-90 focus:ring-[var(--color-danger)]/50 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'min-h-8 px-3 py-1.5 text-xs gap-1.5',
      md: 'min-h-10 px-5 py-2 text-sm gap-2',
      lg: 'min-h-12 px-7 py-3 text-sm gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
