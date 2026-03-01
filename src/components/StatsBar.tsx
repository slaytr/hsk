import type { LevelStats } from '../types'
import { ProgressBar } from './ProgressBar'

interface StatsBarProps {
  stats: LevelStats[]
}

export function StatsBar({ stats }: StatsBarProps) {
  const totalLearned = stats.reduce((sum, s) => sum + s.learned, 0)
  const totalWords = stats.reduce((sum, s) => sum + s.total, 0)
  const pct = totalWords > 0 ? Math.round((totalLearned / totalWords) * 100) : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-900">HSK Study Tracker</h1>
        <span className="text-2xl font-bold text-blue-600">{pct}%</span>
      </div>
      <ProgressBar learned={totalLearned} total={totalWords} size="md" />
      <p className="text-sm text-gray-500 mt-1">
        {totalLearned.toLocaleString()} of {totalWords.toLocaleString()} words learned across all levels
      </p>
    </div>
  )
}
