import type { AnyFn } from '../utils'
import { resolvedPromise } from '../utils'

export class TaskScheduler {
  private queue: (AnyFn)[]
  private readonly limit: number
  private running: number

  constructor(limit = 5) {
    this.queue = []
    this.limit = limit
    this.running = 0
  }

  private run() {
    while (this.running < this.limit && this.queue.length) {
      const task = this.queue.shift()!
      this.running++

      task().finally(() => {
        this.running--
        this.run()
      })
    }
  }

  addTask(task: AnyFn) {
    return new Promise((...args) => {
      this.queue.push(() => resolvedPromise.then(task).then(...args))
      this.run()
    })
  }
}
