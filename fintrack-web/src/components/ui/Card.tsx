import { type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * Componente de card com superfície no design system do FinTrack.
 */
const Card = ({ className, padding = 'md', children, ...props }: CardProps) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
