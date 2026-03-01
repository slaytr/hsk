import type { HskEntry, FilterMode, SortMode } from '../types'

export function filterCards(
  entries: HskEntry[],
  mode: FilterMode,
  query: string,
  learnedIds: Set<string>,
  sortMode: SortMode,
): HskEntry[] {
  let result = entries
  if (mode === 'learned') {
    result = entries.filter(e => learnedIds.has(e.id))
  } else if (mode === 'not-learned') {
    result = entries.filter(e => !learnedIds.has(e.id))
  }

  const q = query.trim().toLowerCase()
  if (q) {
    result = result.filter(
      e =>
        e.character.includes(q) ||
        e.pinyin.toLowerCase().includes(q) ||
        e.meaning.toLowerCase().includes(q),
    )
  }

  if (sortMode === 'frequency') {
    result = [...result].sort((a, b) => {
      if (a.frequencyRank == null && b.frequencyRank == null) return 0
      if (a.frequencyRank == null) return 1
      if (b.frequencyRank == null) return -1
      return a.frequencyRank - b.frequencyRank
    })
  }

  return result
}
