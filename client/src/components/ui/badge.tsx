import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const variants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/15 text-primary',
        outline: 'border-border text-foreground',
        success: 'border-transparent bg-emerald-500/15 text-emerald-400',
        warning: 'border-transparent bg-amber-500/15 text-amber-400',
        danger: 'border-transparent bg-rose-500/15 text-rose-400',
        muted: 'border-transparent bg-muted text-muted-foreground',
        gradient: 'border-transparent text-white bg-brand-gradient',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

interface Props extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof variants> {}

export function Badge({ className, variant, ...props }: Props) {
  return <span className={cn(variants({ variant }), className)} {...props} />;
}
