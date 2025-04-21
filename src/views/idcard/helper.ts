import { getRandomInt } from '~/shared'

export function getRandomItem(arr: any[]) {
  return arr[getRandomInt(0, arr.length - 1)]
}

export function random() {
  return Math.random()
}
