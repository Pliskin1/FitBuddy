interface LogoProps {
  size?: number
  /** Na tamnoj pozadini znak je limeta sa tamnom linijom. */
  inverted?: boolean
}

export function LogoMark({ size = 40, inverted = false }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect
        width="64"
        height="64"
        rx="18"
        style={{ fill: inverted ? 'var(--color-lime)' : 'var(--color-ink)' }}
      />
      <path
        d="M13 34h9l5-13 9 22 5-9h10"
        style={{ fill: 'none', stroke: inverted ? 'var(--color-ink)' : 'var(--color-lime)' }}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
