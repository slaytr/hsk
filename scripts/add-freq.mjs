import { readFileSync, writeFileSync } from 'fs'

const lines = readFileSync('./hanzidb.csv', 'utf8').split('\n').slice(1)
const freqMap = new Map() // character → frequencyRank

for (const line of lines) {
  if (!line.trim()) continue
  const m = line.match(/^(\d+),(.+?),([^,]+),"?([^"]*)"?,([^,]+),([^,]+),(\d+),([^,]*),([^,]*)$/)
  if (!m) continue
  freqMap.set(m[2], parseInt(m[1]))
}

console.log(`HanziDB loaded: ${freqMap.size} characters`)

for (let lvl = 1; lvl <= 6; lvl++) {
  const path = `./src/data/hsk${lvl}.json`
  const entries = JSON.parse(readFileSync(path, 'utf8'))
  const enriched = entries.map(e => {
    const isSingleChar = [...e.character].length === 1
    const rank = isSingleChar ? freqMap.get(e.character) : undefined
    if (rank !== undefined) return { ...e, frequencyRank: rank }
    return e
  })
  writeFileSync(path, JSON.stringify(enriched, null, 2))
  const count = enriched.filter(e => e.frequencyRank !== undefined).length
  console.log(`HSK ${lvl}: ${count}/${entries.length} entries got frequency rank`)
}
