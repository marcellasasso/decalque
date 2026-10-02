import styles from './OpacitySlider.module.css'

type Props = {
  value: number
  onChange: (value: number) => void
}

export function OpacitySlider({ value, onChange }: Props) {
  const percent = Math.round(value * 100)

  return (
    <label className={styles.slider}>
      <span className={styles.label}>Opacidade</span>
      <input
        type="range"
        min={0}
        max={100}
        value={percent}
        onChange={(event) => onChange(Number(event.target.value) / 100)}
      />
      <output className={styles.value}>{percent}%</output>
    </label>
  )
}
