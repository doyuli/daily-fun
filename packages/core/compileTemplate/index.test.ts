import { compileTemplate } from '@daily-fun/core'
import { describe, expect, it } from 'vitest'

describe('compileTemplate', () => {
  it('should be compile template', async () => {
    const user = {
      name: 'doyuli',
      age: 18,
    }
    const template = `期待一下{{user.name}}的{{user.age}}岁生日`
    const { result, error } = compileTemplate(template, { user })
    expect(error).toBe('')
    expect(result).toBe('期待一下doyuli的18岁生日')
  })

  it('should evaluate expressions', () => {
    const template = 'The sum is {{ a + b }} and double is {{ c * 2 }}.'
    const context = { a: 3, b: 4, c: 5 }
    const { result, error } = compileTemplate(template, context)
    expect(error).toBe('')
    expect(result).toBe('The sum is 7 and double is 10.')
  })

  it('should handle nested properties', () => {
    const template = 'User: {{ user.name }}, Age: {{ user.profile.age }}'
    const context = {
      user: {
        name: 'Bob',
        profile: { age: 30 },
      },
    }
    const { result, error } = compileTemplate(template, context)
    expect(error).toBe('')
    expect(result).toBe('User: Bob, Age: 30')
  })

  it('should return empty string for undefined variables', () => {
    const template = 'Value: {{ missing }}'
    const { result, error } = compileTemplate(template, {})
    expect(result).toMatch(/Value: (undefined|)/)
    expect(error).toBe('')
  })

  it('should catch syntax errors in snippet', () => {
    const template = 'Bad: {{ 1 + }}'
    const { result, error } = compileTemplate(template, {})
    expect(error).not.toBe('')
    expect(error).toContain('Unexpected token')
    expect(result).toBe('')
  })

  it('should not execute dangerous code', () => {
    const template = '{{ globalThis.fetch }}'
    const { result, error } = compileTemplate(template, {})
    expect(error).toBe('')
    expect(result).toBe('')
  })

  it('should handle falsy values correctly', () => {
    const template = 'Zero: {{ zero }}, False: {{ flag }}, Null: {{ nil }}'
    const context = { zero: 0, flag: false, nil: null }
    const { result, error } = compileTemplate(template, context)
    expect(error).toBe('')
    expect(result).toBe('Zero: 0, False: false, Null: null')
  })
})
