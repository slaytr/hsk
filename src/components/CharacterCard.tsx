import type { HskEntry } from '../types'

interface CharacterCardProps {
  entry: HskEntry
  isLearned: boolean
  isSelected: boolean
  onToggle: (id: string) => void
  onSelect: (entry: HskEntry) => void
  animationDelay?: number
}

export function CharacterCard({ entry, isLearned, isSelected, onToggle, onSelect, animationDelay }: CharacterCardProps) {
  return (
    <div
      draggable
      onClick={() => onToggle(entry.id)}
      onDragStart={e => {
        e.dataTransfer.setData('text/plain', entry.pinyin)
        e.dataTransfer.effectAllowed = 'copy'
        onSelect(entry)
      }}
      style={
        animationDelay !== undefined
          ? { animation: `card-enter 280ms ease-out ${animationDelay}ms both` }
          : undefined
      }
      className={`
        group relative flex flex-col items-center justify-center h-20 px-2 rounded-xl border-2
        transition-all duration-150 cursor-grab active:cursor-grabbing select-none text-center overflow-hidden
        hover:shadow-md hover:-translate-y-0.5
        ${isSelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
        ${isLearned
          ? 'bg-green-50 border-green-400 text-green-900'
          : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'
        }
      `}
    >
      {isLearned && (
        <span className="absolute top-1.5 right-1.5 text-green-500 text-xs leading-none">✓</span>
      )}

      <span className="text-3xl font-bold leading-tight flex-shrink-0">{entry.character}</span>

      <div className="max-h-0 overflow-hidden group-hover:max-h-8 transition-all duration-200 w-full">
        <span className={`block text-xs mt-1 truncate ${isLearned ? 'text-green-600' : 'text-gray-400'}`}>
          {entry.pinyin}
        </span>
      </div>
    </div>
  )
}
