import type { FilterMode, SortMode } from '../types'

interface FilterBarProps {
  filterMode: FilterMode
  onFilterChange: (mode: FilterMode) => void
  sortMode: SortMode
  onSortChange: (mode: SortMode) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  resultCount: number
  totalCount: number
}

const FILTERS: { label: string; value: FilterMode }[] = [
  { label: 'All', value: 'all' },
  { label: 'Learned', value: 'learned' },
  { label: 'Not Learned', value: 'not-learned' },
]

export function FilterBar({
  filterMode,
  onFilterChange,
  sortMode,
  onSortChange,
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              filterMode === f.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => onSortChange(sortMode === 'default' ? 'frequency' : 'default')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border transition-colors whitespace-nowrap ${
          sortMode === 'frequency'
            ? 'bg-blue-50 border-blue-300 text-blue-700'
            : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700'
        }`}
      >
        Sort by: Frequency Rank
      </button>

      <input
        type="search"
        placeholder="Search character, pinyin, meaning..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        onDrop={e => { e.preventDefault(); onSearchChange(e.dataTransfer.getData('text/plain')) }}
        className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-0"
      />

      <span className="text-sm text-gray-400 whitespace-nowrap">
        {resultCount === totalCount ? `${totalCount} total` : `${resultCount} of ${totalCount}`}
      </span>
    </div>
  )
}
