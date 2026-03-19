import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Componente de input com suporte a label, ícones laterais e mensagem de erro.
 * O padding é definido via inline style para garantir compatibilidade com Tailwind v4.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-[var(--color-text-secondary)]">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-11 rounded-xl text-sm text-[var(--color-text-primary)] transition-all duration-200',
              'bg-[var(--color-surface-elevated)] border',
              'placeholder:text-[var(--color-text-secondary)]/50',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]',
              error
                ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20'
                : 'border-[var(--color-border)]',
              className
            )}
            /* Padding via inline style para evitar problema com classes dinâmicas no Tailwind v4 */
            style={{
              paddingLeft: leftIcon ? '2.5rem' : '0.875rem',
              paddingRight: rightIcon ? '2.75rem' : '0.875rem',
            }}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-[var(--color-danger)] flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
