import { useState, useMemo, useEffect } from 'react'
import type { HskLevel, HskEntry, FilterMode, SortMode, LevelStats } from './types'
import { ALL_LEVELS, LEVEL_TOTALS, loadLevelData } from './data'
import { useLearnedCards } from './hooks/useLearnedCards'
import { filterCards } from './utils/filterCards'
import { StatsBar } from './components/StatsBar'
import { LevelTabs } from './components/LevelTabs'
import { FilterBar } from './components/FilterBar'
import { CharacterGrid } from './components/CharacterGrid'
import { CharacterDetail } from './components/CharacterDetail'
import { ProgressBar } from './components/ProgressBar'

export default function App() {
  const [activeLevel, setActiveLevel] = useState<HskLevel>(1)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentEntries, setCurrentEntries] = useState<HskEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<HskEntry | null>(null)

  const { learnedIds, toggleLearned, resetLevel } = useLearnedCards()

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    loadLevelData(activeLevel).then(data => {
      if (!cancelled) {
        setCurrentEntries(data)
        setIsLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [activeLevel])

  const levelStats: LevelStats[] = useMemo(
    () =>
      ALL_LEVELS.map(level => ({
        level,
        total: LEVEL_TOTALS[level],
        learned: [...learnedIds].filter(id => id.startsWith(`hsk${level}_`)).length,
      })),
    [learnedIds],
  )

  const filteredEntries = useMemo(
    () => filterCards(currentEntries, filterMode, searchQuery, learnedIds, sortMode),
    [currentEntries, filterMode, searchQuery, learnedIds, sortMode],
  )

  const activeStat = levelStats.find(s => s.level === activeLevel)!

  function handleLevelChange(level: HskLevel) {
    setActiveLevel(level)
    setFilterMode('all')
    setSortMode('default')
    setSearchQuery('')
    setSelectedEntry(null)
  }

  function handleResetLevel() {
    if (window.confirm(`Reset all learned words for HSK ${activeLevel}?`)) {
      resetLevel(currentEntries)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky top header */}
      <div className="sticky top-0 z-10 bg-gray-50 px-4 pt-4 sm:pt-6 pb-4 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 items-start">
          <div className="space-y-4">
            <StatsBar stats={levelStats} />
            <LevelTabs
              activeLevel={activeLevel}
              onSelectLevel={handleLevelChange}
              stats={levelStats}
            />
          </div>
          <div className="hidden sm:block">
            <CharacterDetail
              entry={selectedEntry}
              isLearned={selectedEntry ? learnedIds.has(selectedEntry.id) : false}
              onToggle={toggleLearned}
            />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">HSK {activeLevel}</h2>
              <div className="mt-1 max-w-xs">
                <ProgressBar learned={activeStat.learned} total={activeStat.total} size="md" />
              </div>
            </div>
            <button
              onClick={handleResetLevel}
              className="text-xs text-red-400 hover:text-red-600 transition-colors mt-1 flex-shrink-0"
            >
              Reset level
            </button>
          </div>

          <FilterBar
            filterMode={filterMode}
            onFilterChange={setFilterMode}
            sortMode={sortMode}
            onSortChange={setSortMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredEntries.length}
            totalCount={currentEntries.length}
          />

          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Loading HSK {activeLevel}…
            </div>
          ) : (
            <CharacterGrid
              entries={filteredEntries}
              learnedIds={learnedIds}
              selectedId={selectedEntry?.id ?? null}
              onToggle={toggleLearned}
              onSelect={setSelectedEntry}
            />
          )}
        </div>
      </div>

    </div>
  )
}
