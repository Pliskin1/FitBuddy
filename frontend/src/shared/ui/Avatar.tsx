import { cn } from '@/shared/lib/cn'
import styles from './Avatar.module.css'

interface AvatarProps {
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
  muted?: boolean
}

/** Inicijali osobe. Dekorativan je – ime uvijek stoji pored kao tekst. */
export function Avatar({ firstName, lastName, size = 'md', muted }: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  return (
    <span aria-hidden="true" className={cn(styles.avatar, styles[size], muted && styles.muted)}>
      {initials}
    </span>
  )
}
