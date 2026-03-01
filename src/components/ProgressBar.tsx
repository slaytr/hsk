interface ProgressBarProps {
  learned: number
  total: number
  showLabel?: boolean
  size?: 'sm' | 'md'
}

function progressColor(pct: number): string {
  // Blue (220°) at 0% → Green (145°) at 100%
  const hue = 220 - 75 * (pct / 100)
  const sat = 80 - 15 * (pct / 100)
  const light = 55 - 10 * (pct / 100)
  return `hsl(${hue}, ${sat}%, ${light}%)`
}

export function ProgressBar({ learned, total, showLabel = true, size = 'md' }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((learned / total) * 100) : 0

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${size === 'sm' ? 'h-1' : 'h-2'}`}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            backgroundColor: pct > 0 ? progressColor(pct) : undefined,
          }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-0.5 text-right">
          {learned}/{total}
        </p>
      )}
    </div>
  )
}
