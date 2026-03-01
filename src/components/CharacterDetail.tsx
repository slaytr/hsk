import { useState } from 'react'
import type { HskEntry } from '../types'

interface CharacterDetailProps {
  entry: HskEntry | null
  isLearned: boolean
  onToggle: (id: string) => void
}

export function CharacterDetail({ entry, isLearned, onToggle }: CharacterDetailProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={e => { e.preventDefault(); setIsDragOver(false) }}
      className={`
        h-54 bg-white rounded-2xl border-2 shadow-sm px-5 py-4 flex flex-col overflow-hidden
        transition-colors duration-150
        ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-100'}
      `}
    >
      {entry ? (
        <>
          <div className="flex items-baseline justify-between gap-2 flex-shrink-0">
            <span className="text-5xl font-bold text-gray-900 leading-none">{entry.character}</span>
            {entry.frequencyRank !== undefined && (
              <span className="text-xs text-gray-400 whitespace-nowrap">#{entry.frequencyRank}</span>
            )}
          </div>
          <span className="text-base text-blue-500 font-medium mt-1 flex-shrink-0">{entry.pinyin}</span>
          <p className="text-sm text-gray-600 leading-snug mt-1 line-clamp-5">{entry.meaning}</p>
          <div className="flex items-center justify-between mt-auto pt-2 flex-shrink-0">
            <a
              href={`https://www.pandanese.com/search?q=${encodeURIComponent(entry.character)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 hover:text-blue-600 transition-colors"
            >
              Open in Pandanese →
            </a>
            <button
              onClick={() => onToggle(entry.id)}
              className={`
                text-xs px-2.5 py-1 rounded-lg border transition-colors duration-150
                ${isLearned
                  ? 'bg-green-50 border-green-300 text-green-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
                }
              `}
            >
              {isLearned ? 'Learned ✓' : 'Mark learned'}
            </button>
          </div>
        </>
      ) : (
        <p className="m-auto text-sm text-gray-400 text-center select-none">
          Drag a character here to see details
        </p>
      )}
    </div>
  )
}
