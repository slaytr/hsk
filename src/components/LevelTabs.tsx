import type { HskLevel, LevelStats } from '../types'
import { ALL_LEVELS } from '../data'
import { ProgressBar } from './ProgressBar'

interface LevelTabsProps {
  activeLevel: HskLevel
  onSelectLevel: (level: HskLevel) => void
  stats: LevelStats[]
}

export function LevelTabs({ activeLevel, onSelectLevel, stats }: LevelTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {ALL_LEVELS.map(level => {
        const stat = stats.find(s => s.level === level)!
        const isActive = level === activeLevel
        return (
          <button
            key={level}
            onClick={() => onSelectLevel(level)}
            className={`
              flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all min-w-[90px]
              ${isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }
            `}
          >
            <div className="font-semibold">HSK {level}</div>
            <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
              {stat.learned}/{stat.total}
            </div>
            <div className="mt-1.5">
              <ProgressBar learned={stat.learned} total={stat.total} showLabel={false} size="sm" />
            </div>
          </button>
        )
      })}
    </div>
  )
}
