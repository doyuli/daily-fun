export interface FormItem {
  label: string
  field: string
  type: string
  props?: Record<string, any>
  rules?: Record<string, any>
  dynamics?: DynamicsFn
  span?: number
  [key: string]: any
}

export interface DynamicsFn {
  disabled?: () => boolean
  options?: () => Promise<Record<string, any>[]> | Record<string, any>[]
  show?: () => boolean
}
