import { useState, useEffect, useRef } from 'react'
import type { HskEntry } from '../types'
import { CharacterCard } from './CharacterCard'

const PAGE_SIZE = 200

interface CharacterGridProps {
  entries: HskEntry[]
  learnedIds: Set<string>
  selectedId: string | null
  onToggle: (id: string) => void
  onSelect: (entry: HskEntry) => void
}

export function CharacterGrid({ entries, learnedIds, selectedId, onToggle, onSelect }: CharacterGridProps) {
  const [page, setPage] = useState(1)
  const batchStartRef = useRef(0)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const visible = entries.slice(0, page * PAGE_SIZE)
  const hasMore = entries.length > visible.length

  useEffect(() => {
    batchStartRef.current = 0
    setPage(1)
  }, [entries])

  useEffect(() => {
    if (!hasMore || !sentinelRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          batchStartRef.current = page * PAGE_SIZE
          setPage(p => p + 1)
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [hasMore, page])

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        No characters match your filter.
      </div>
    )
  }

  const batchStart = batchStartRef.current

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
        {visible.map((entry, index) => {
          const posInBatch = index - batchStart
          const animationDelay = posInBatch >= 0 ? Math.min(posInBatch, 20) * 15 : undefined
          return (
            <CharacterCard
              key={entry.id}
              entry={entry}
              isLearned={learnedIds.has(entry.id)}
              isSelected={entry.id === selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
              animationDelay={animationDelay}
            />
          )
        })}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="h-8 mt-4" aria-hidden />
      )}
    </div>
  )
}
