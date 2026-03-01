import { useState, useEffect } from 'react'
import type { HskEntry } from '../types'

const STORAGE_KEY = 'hsk_learned_ids'

export interface UseLearnedCardsReturn {
  learnedIds: Set<string>
  toggleLearned: (id: string) => void
  resetLevel: (entries: HskEntry[]) => void
  isLearned: (id: string) => boolean
}

export function useLearnedCards(): UseLearnedCardsReturn {
  const [learnedIds, setLearnedIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
    } catch {
      return new Set()
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...learnedIds]))
  }, [learnedIds])

  const toggleLearned = (id: string): void => {
    setLearnedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const resetLevel = (entries: HskEntry[]): void => {
    const levelIds = new Set(entries.map(e => e.id))
    setLearnedIds(prev => new Set([...prev].filter(id => !levelIds.has(id))))
  }

  const isLearned = (id: string): boolean => learnedIds.has(id)

  return { learnedIds, toggleLearned, resetLevel, isLearned }
}
