/** Spaja CSS klase i preskače prazne vrijednosti: cn('a', uslov && 'b'). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
