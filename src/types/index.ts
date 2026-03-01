export type HskLevel = 1 | 2 | 3 | 4 | 5 | 6

export interface HskEntry {
  id: string
  character: string
  pinyin: string
  meaning: string
  level: HskLevel
  frequencyRank?: number
}

export type FilterMode = 'all' | 'learned' | 'not-learned'

export type SortMode = 'default' | 'frequency'

export interface LevelStats {
  level: HskLevel
  total: number
  learned: number
}
