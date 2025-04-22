/**
 * 防抖函数
 * @param fn 
 * @param delay 
 * @returns 
 */
export function debounced<T>(fn: (...args: T[]) => void, delay: number) {
  let timer: NodeJS.Timeout

  return (...args: T[]) => {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}