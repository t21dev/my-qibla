import { cn } from '../../utils/cn'

interface BoxProps {
  children: React.ReactNode
  className?: string
  glass?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  center?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Box({
  children,
  className,
  glass = false,
  padding = 'none',
  center = false,
}: BoxProps) {
  return (
    <div
      className={cn(
        paddingMap[padding],
        glass && 'glass rounded-2xl',
        center && 'flex flex-col items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  )
}
