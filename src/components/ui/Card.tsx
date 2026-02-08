import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6',
        className
      )}
    >
      {children}
    </div>
  )
}
