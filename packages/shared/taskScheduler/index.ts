import { promise, type AnyFn } from '~/shared'

/**
 * 任务调度器
 */
export class TaskScheduler {
  tasks: AnyFn[]
  limit: number
  running: number
  constructor(limit = 2) {
    this.tasks = []
    this.limit = limit
    this.running = 0
  }

  /**
   * 执行任务
   */
  run() {
    if (this.running >= this.limit || !this.tasks.length) return

    const task = this.tasks.shift()!
    this.running++
    task().finally(() => {
      this.running--
      this.run()
    })
  }

  /**
   * 添加任务
   * @param task 任务
   * @returns 返回一个promise
   */
  addTask(task: AnyFn) {
    // return new Promise 是为了让调用者能 await 或 .then() 这个 task 的结果
    return new Promise((...args) => {
      this.tasks.push(() => promise.then(task).then(...args))
      this.run()
    })
  }
}

export const scheduler = new TaskScheduler()
