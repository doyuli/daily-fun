import { createTsdownConfig } from '../../tsdown.config.ts'

export default createTsdownConfig({
  iife: false,
  external: ['vite'],
})
