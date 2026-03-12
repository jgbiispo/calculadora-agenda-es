import styles from './Control.module.css'

export function SliderControl({ label, min, max, value, step = 1, onChange, display }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.slider}>
        <input type="range" min={min} max={max} value={value} step={step} onChange={e => onChange(+e.target.value)} />
      </div>
      <span className={styles.value}>{display ?? value}</span>
    </div>
  )
}

export function TimeControl({ label, value, onChange }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.timeWrap}>
        <input type="time" value={value} onChange={e => onChange(e.target.value)} />
      </div>
      <span className={styles.value} />
    </div>
  )
}
