import { cn } from '../../utils/cn'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function Title({ children, className }: TypographyProps) {
  return (
    <h1 className={cn('text-3xl font-bold tracking-tight text-white', className)}>
      {children}
    </h1>
  )
}

export function Heading({ children, className }: TypographyProps) {
  return (
    <h2 className={cn('text-xl font-semibold text-white', className)}>
      {children}
    </h2>
  )
}

export function Text({ children, className }: TypographyProps) {
  return (
    <p className={cn('text-base text-gray-300', className)}>
      {children}
    </p>
  )
}

export function Caption({ children, className }: TypographyProps) {
  return (
    <span className={cn('text-sm text-gray-400', className)}>
      {children}
    </span>
  )
}

export function Label({ children, className }: TypographyProps) {
  return (
    <span className={cn('text-xs font-medium uppercase tracking-wider text-gray-500', className)}>
      {children}
    </span>
  )
}
