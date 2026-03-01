import { readFileSync, writeFileSync } from 'fs'

// ── Pinyin numeric → tone marks ──────────────────────────────────────────────
const TONE_MARKS = {
  a: ['ā','á','ǎ','à','a'],
  e: ['ē','é','ě','è','e'],
  i: ['ī','í','ǐ','ì','i'],
  o: ['ō','ó','ǒ','ò','o'],
  u: ['ū','ú','ǔ','ù','u'],
  ü: ['ǖ','ǘ','ǚ','ǜ','ü'],
}

function addToneMark(syllable, tone) {
  // tone is 0-indexed (0=1st, 4=neutral)
  syllable = syllable.replace(/v/g, 'ü')
  // Rule 1: a or e always takes mark
  if (/a/.test(syllable)) return syllable.replace('a', TONE_MARKS.a[tone])
  if (/e/.test(syllable)) return syllable.replace('e', TONE_MARKS.e[tone])
  // Rule 2: ou → o takes mark
  if (/ou/.test(syllable)) return syllable.replace('o', TONE_MARKS.o[tone])
  // Rule 3: last vowel takes mark
  const vowelOrder = ['ü','u','i','o','e','a']
  for (let i = syllable.length - 1; i >= 0; i--) {
    const ch = syllable[i]
    if (vowelOrder.includes(ch)) {
      return syllable.slice(0, i) + TONE_MARKS[ch][tone] + syllable.slice(i + 1)
    }
  }
  return syllable
}

function numericToToneMarks(pinyin) {
  // Each syllable ends with a digit 1-5
  return pinyin.replace(/([a-züA-ZÜ:]+)([1-5])/g, (_, syl, num) => {
    const tone = parseInt(num) - 1
    return addToneMark(syl.toLowerCase(), tone)
  })
}

// ── Parse CC-CEDICT ──────────────────────────────────────────────────────────
const lines = readFileSync('./cedict.txt', 'utf8').split('\n')
const dict = new Map() // simplified → [{pinyin (tone marks), meanings[]}]

for (const line of lines) {
  if (!line || line.startsWith('#') || line.startsWith('%')) continue
  const m = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/\s*$/)
  if (!m) continue
  const simplified = m[2]
  const pinyinRaw = m[3]
  const pinyin = numericToToneMarks(pinyinRaw)
  const meanings = m[4].split('/').map(s => s.trim()).filter(Boolean)
  if (!dict.has(simplified)) dict.set(simplified, [])
  dict.get(simplified).push({ pinyin, meanings })
}

console.log(`CC-CEDICT loaded: ${dict.size} entries`)

// ── Enrich HSK data files ────────────────────────────────────────────────────
let notFound = []

for (let lvl = 1; lvl <= 6; lvl++) {
  const entries = JSON.parse(readFileSync(`./src/data/hsk${lvl}.json`, 'utf8'))

  const enriched = entries.map(entry => {
    const cedictEntries = dict.get(entry.character)
    if (!cedictEntries) {
      notFound.push({ level: lvl, character: entry.character })
      return entry // keep original if not found
    }

    // Build combined pinyin: "dōu / dū"
    const pinyins = cedictEntries.map(e => e.pinyin)
    const pinyin = [...new Set(pinyins)].join(' / ')

    // Build combined meaning: group by reading, take top 3 meanings each
    const meaningParts = cedictEntries.map(e => {
      // Skip entries that are just proper nouns (surname X, variant of X)
      const useful = e.meanings.filter(m =>
        !m.startsWith('see ') &&
        !m.startsWith('variant of') &&
        !m.match(/^surname /)
      )
      return useful.slice(0, 3).join('; ')
    }).filter(Boolean)

    // Deduplicate and join readings with ' / '
    const meaning = [...new Set(meaningParts)].join(' / ')

    return {
      ...entry,
      pinyin,
      meaning: meaning || cedictEntries[0].meanings[0],
    }
  })

  writeFileSync(`./src/data/hsk${lvl}.json`, JSON.stringify(enriched, null, 2))
  console.log(`HSK ${lvl}: ${enriched.length} entries updated`)
}

if (notFound.length > 0) {
  console.log(`\nNot found in CEDICT (${notFound.length}):`)
  notFound.forEach(e => console.log(`  HSK${e.level}: ${e.character}`))
}

// Verify the examples the user mentioned
console.log('\n── Verification ──')
for (const w of ['多少', '都', '爱', '你好', '吃']) {
  const e = dict.get(w)
  if (e) e.forEach(x => console.log(`${w} | ${x.pinyin} | ${x.meanings[0]}`))
}
