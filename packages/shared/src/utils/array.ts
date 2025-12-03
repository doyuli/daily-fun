export function shuffle<T = any>(arr: T[]): T[] {
  const shuffled = arr.slice()

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export function unique<T = any>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

export function chunk<T = any>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size)
    chunks.push(arr.slice(i, i + size))

  return chunks
}
