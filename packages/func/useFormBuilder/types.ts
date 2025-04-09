import type { SetupContext, Component } from 'vue'

export interface FormItem {
  label: string
  field: string
  type: string | Component
  props?: Record<string, any>
  rules?: Record<string, any>
  dynamics?: DynamicsFn
  slots?: SetupContext['slots']
  span?: number
  [key: string]: any
}

export interface DynamicsFn {
  disabled?: () => boolean
  options?: () => Promise<Record<string, any>[]> | Record<string, any>[]
  show?: () => boolean
}
