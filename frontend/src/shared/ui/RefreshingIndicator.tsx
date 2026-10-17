import styles from './Layout.module.css'

/** Mali znak da se lista osvježava u pozadini (npr. poslije promjene filtera), bez skrivanja starih podataka. */
export function RefreshingIndicator({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <span className={styles.refreshing} role="status" aria-live="polite">
      <span className={styles.dot} aria-hidden="true" />
      Osvježavam…
    </span>
  )
}
