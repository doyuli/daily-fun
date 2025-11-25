import { createTsdownConfig } from '../../tsdown.config.ts'

export default createTsdownConfig({
  entry: {
    index: 'src/index.ts',
    asyncCatch: 'src/asyncCatch/index.ts',
  },
  iife: false,
})
