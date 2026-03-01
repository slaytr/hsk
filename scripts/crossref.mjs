import { readFileSync, writeFileSync } from 'fs'

// ── Parse HanziDB ────────────────────────────────────────────────────────────
// Columns: frequency_rank,character,pinyin,definition,radical,radical_code,stroke_count,hsk_level,general_standard_num
const lines = readFileSync('./hanzidb.csv', 'utf8').split('\n').slice(1) // skip header
const hanziMap = new Map() // character → { frequencyRank, strokeCount, radical, hskLevel, definition, pinyin }

for (const line of lines) {
  if (!line.trim()) continue
  // CSV: some fields are quoted (definition has commas)
  const m = line.match(/^(\d+),(.+?),([^,]+),"?([^"]*)"?,([^,]+),([^,]+),(\d+),([^,]*),([^,]*)$/)
  if (!m) continue
  const [, frequencyRank, character, pinyin, definition, radical,, strokeCount, hskLevel] = m
  hanziMap.set(character, {
    frequencyRank: parseInt(frequencyRank),
    strokeCount: parseInt(strokeCount),
    radical,
    hskLevel: hskLevel ? parseInt(hskLevel) : null,
    definition,
    pinyin,
  })
}

console.log(`HanziDB loaded: ${hanziMap.size} characters`)

// ── Cross-reference each HSK level ──────────────────────────────────────────
let totalEntries = 0
let totalSingleChar = 0
let matchedInHanziDB = 0
let levelMismatch = []
let notInHanziDB = []

for (let lvl = 1; lvl <= 6; lvl++) {
  const entries = JSON.parse(readFileSync(`./src/data/hsk${lvl}.json`, 'utf8'))
  totalEntries += entries.length

  const single = entries.filter(e => [...e.character].length === 1)
  const multi  = entries.filter(e => [...e.character].length >  1)
  totalSingleChar += single.length

  let matched = 0
  for (const e of single) {
    const h = hanziMap.get(e.character)
    if (!h) {
      notInHanziDB.push({ level: lvl, character: e.character })
      continue
    }
    matched++
    matchedInHanziDB++
    if (h.hskLevel && h.hskLevel !== lvl) {
      levelMismatch.push({
        character: e.character,
        ourLevel: lvl,
        hanzidbLevel: h.hskLevel,
        freq: h.frequencyRank,
      })
    }
  }

  console.log(`HSK ${lvl}: ${entries.length} entries (${single.length} single-char, ${multi.length} multi-char) — ${matched}/${single.length} found in HanziDB`)
}

console.log(`\nTotal: ${totalEntries} entries, ${totalSingleChar} single-char, ${matchedInHanziDB} matched in HanziDB`)

if (levelMismatch.length > 0) {
  console.log(`\nHSK level mismatches (our level vs HanziDB): ${levelMismatch.length}`)
  levelMismatch
    .sort((a, b) => a.ourLevel - b.ourLevel)
    .forEach(e => console.log(`  ${e.character}  ours=HSK${e.ourLevel}  hanzidb=HSK${e.hanzidbLevel}  freq_rank=${e.freq}`))
}

if (notInHanziDB.length > 0) {
  console.log(`\nSingle-char entries missing from HanziDB (${notInHanziDB.length}):`)
  notInHanziDB.forEach(e => console.log(`  HSK${e.level}: ${e.character}`))
}
