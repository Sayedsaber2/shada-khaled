import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'

/** Join class names conditionally: cn('a', isActive && 'b') */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
