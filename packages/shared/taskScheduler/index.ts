import { promise, type AnyFn } from '~/shared'

class TaskScheduler {
  tasks: AnyFn[]
  limit: number
  running: number
  constructor(limit = 2) {
    this.tasks = []
    this.limit = limit
    this.running = 0
  }

  run() {
    if (this.running >= this.limit || !this.tasks.length) return

    const task = this.tasks.shift()!
    this.running++
    task().finally(() => {
      this.running--
      this.run()
    })
  }

  addTask(task: AnyFn) {
    return new Promise((...args) => {
      this.tasks.push(() => promise.then(task).then(...args))
      this.run()
    })
  }
}

export const scheduler = new TaskScheduler()
