// @ts-check

import { execSync } from 'node:child_process'
import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import {
  cancel,
  intro,
  isCancel,
  outro,
  select,
} from '@clack/prompts'
import color from 'picocolors'

async function main() {
  console.log()
  intro(color.bgBlue(' prompts runing '))

  const scripts = await getPackageScripts()

  const script = await select({
    message: 'Select the script you need to run:',
    options: scripts,
  })

  if (isCancel(script) || !script) {
    cancel('Operation cancelled')
    return process.exit(0)
  }

  outro('Running via pnpm')

  execSync(`pnpm run ${script}`, { stdio: 'inherit' })
}

async function getPackageScripts() {
  const jsonRaw = await fs.readFile(resolve(process.cwd(), 'package.json'), 'utf-8')
  const json = JSON.parse(jsonRaw)
  return Object.entries(json.scripts).map(([key, value]) => {
    return {
      label: key,
      value: key,
      hint: value,
    }
  }).filter(i => i.label !== 'dev')
}

main().catch(console.error)
