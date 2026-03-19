import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * Componente de input com suporte a label, ícones e mensagem de erro.
 * Exibe borda vermelha e mensagem quando há erro de validação.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-10 bg-[var(--color-surface)] border rounded-lg text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]',
              leftIcon ? 'pl-10 pr-4' : 'px-4',
              rightIcon ? 'pr-10' : '',
              error
                ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
                : 'border-[var(--color-border)]',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-[var(--color-danger)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
