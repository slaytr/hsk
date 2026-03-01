import type { HskEntry, HskLevel } from '../types'

export const ALL_LEVELS: HskLevel[] = [1, 2, 3, 4, 5, 6]

export const LEVEL_TOTALS: Record<HskLevel, number> = {
  1: 150,
  2: 147,
  3: 298,
  4: 598,
  5: 1298,
  6: 2500,
}

const cache = new Map<HskLevel, HskEntry[]>()

export async function loadLevelData(level: HskLevel): Promise<HskEntry[]> {
  if (cache.has(level)) return cache.get(level)!
  const loaders: Record<HskLevel, () => Promise<unknown>> = {
    1: () => import('./hsk1.json'),
    2: () => import('./hsk2.json'),
    3: () => import('./hsk3.json'),
    4: () => import('./hsk4.json'),
    5: () => import('./hsk5.json'),
    6: () => import('./hsk6.json'),
  }
  const mod = await loaders[level]() as { default: HskEntry[] }
  const data = mod.default
  cache.set(level, data)
  return data
}
