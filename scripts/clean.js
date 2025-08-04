#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import pico from 'picocolors'

const CONFIG = {
  target: 'node_modules',
  targetDir: process.cwd(),
  excludeDirs: ['.git', '.cache', 'dist'],
  dryRun: false,
}

async function clean() {
  const startTime = Date.now()
  let totalCount = 0
  let totalSize = 0

  console.log()
  console.log(pico.green(`Starting to scan ${CONFIG.target} in ${CONFIG.targetDir}...`))

  const nodeModulesPaths = await findNodeModulesDirs(CONFIG.targetDir)

  if (nodeModulesPaths.length === 0) {
    console.log(pico.green(`${CONFIG.target} directory not found`))
    return
  }

  for (const dir of nodeModulesPaths) {
    const size = await getDirSize(dir)
    totalSize += size
    console.log(`${dir} (${formatFileSize(size)})`)
  }

  if (!CONFIG.dryRun) {
    const readline = await import('node:readline/promises')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    const answer = await rl.question(`即将删除 ${nodeModulesPaths.length} 个 ${CONFIG.target} 目录 (共 ${formatFileSize(totalSize)})，确认吗？(y/N) `)
    rl.close()

    if (answer.toLowerCase() !== 'y') {
      console.log('operation canceled')
      return
    }
  }

  for (const dir of nodeModulesPaths) {
    try {
      if (CONFIG.dryRun) {
        console.log(`[mork] will delete ${dir}...`)
      }
      else {
        console.log(`deleting ${path.relative(CONFIG.targetDir, dir)}...`)
        await fs.rm(dir, { recursive: true, force: true })
        totalCount++
      }
    }
    catch (err) {
      console.error(pico.red(`deletion failed ${dir}: ${err.message}`))
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  if (CONFIG.dryRun) {
    console.log(`mork completed, a total of ${nodeModulesPaths.length} ${CONFIG.target} were scanned`)
  }
  else {
    console.log(pico.green(`Deletion complete! Cleaned ${totalCount} ${CONFIG.target}, freeing ${formatFileSize(totalSize)}, took ${elapsed}s`))
  }
}

async function findNodeModulesDirs(dir) {
  const results = []
  const stack = [dir]

  while (stack.length > 0) {
    const currentDir = stack.pop()
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const fullPath = path.join(currentDir, entry.name)

          if (CONFIG.excludeDirs.includes(entry.name)) {
            continue
          }

          if (entry.name === CONFIG.target) {
            results.push(fullPath)
            continue
          }

          stack.push(fullPath)
        }
      }
    }
    catch (err) {
      console.error(pico.red(`Unable to read directory ${currentDir}: ${err.message}`))
    }
  }

  return results
}

async function getDirSize(dir) {
  let size = 0
  const stack = [dir]

  while (stack.length > 0) {
    const currentPath = stack.pop()
    const stats = await fs.stat(currentPath)

    if (stats.isDirectory()) {
      const entries = await fs.readdir(currentPath)
      for (const entry of entries) {
        stack.push(path.join(currentPath, entry))
      }
    }
    else {
      size += stats.size
    }
  }

  return size
}

function formatFileSize(bytes) {
  if (bytes === 0)
    return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}`
}

clean().catch((err) => {
  console.error(pico.red(`Script execution error: ${err.message}`))
  process.exit(1)
})
