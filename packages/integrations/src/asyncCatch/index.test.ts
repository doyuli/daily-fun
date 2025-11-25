import { compile } from '@daily-fun/integrations/asyncCatch'
import { describe, expect, it } from 'vitest'

describe('asyncCatch', () => {
  it('should wrap await expression in try...catch with default options', async () => {
    const input = `
    async function fetchData() {
      const res1 = await fetch('/api');
      const res2 = await fetch('/api');
      return res.json();
    }
  `
    const output = compile(input)

    expect(output).toContain('try {')
    expect(output).toContain('} catch (e) {')
    expect(output).toContain('console.error(e)')
    expect(output).toMatch(/return res\.json\(\);/)
  })

  it('should not wrap if already inside try...catch', () => {
    const input = `
      async function fetchData() {
        try {
          await fetch('/api');
        } catch (err) {
          console.log('handled');
        }
      }
    `

    const output = compile(input)
    const tryCount = (output.match(/try\s*\{/g) || []).length
    expect(tryCount).toBe(1)
  })

  it('should support custom catchCode as string', () => {
    const input = `
      async function test() {
        await something();
      }
    `

    const output = compile(input, {
      catchCode: 'alert("Error: " + e.message)',
    })

    expect(output).toContain('alert("Error: " + e.message)')
  })

  it('should support custom identifier', () => {
    const input = `
      async function test() {
        await something();
      }
    `

    const output = compile(input, {
      identifier: 'err',
      catchCode: id => `logger.error(${id})`,
    })

    expect(output).toContain('catch (err)')
    expect(output).toContain('logger.error(err)')
  })

  it('should support finallyCode', () => {
    const input = `
      async function test() {
        await something();
      }
    `

    const output = compile(input, {
      finallyCode: 'cleanup();',
    })

    expect(output).toContain('finally {')
    expect(output).toContain('cleanup();')
  })

  it('should handle arrow async functions', () => {
    const input = `
      const fetchData = async () => {
        await fetch('/api');
      };
    `

    const output = compile(input)
    expect(output).toContain('try {')
  })

  it('should handle class async methods', () => {
    const input = `
      class Api {
        async getData() {
          await fetch('/data');
        }
      }
    `

    const output = compile(input)
    expect(output).toContain('try {')
  })

  it('should not wrap non-async functions', () => {
    const input = `
      function syncFn() {
        console.log('no await');
      }
    `

    const output = compile(input)
    expect(output).not.toContain('try {')
  })

  it('should not wrap async function without await', () => {
    const input = `
      async function noAwait() {
        return 42;
      }
    `

    const output = compile(input)
    expect(output).not.toContain('try {')
  })
})
