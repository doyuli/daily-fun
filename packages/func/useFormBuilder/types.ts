export interface FormItem {
    label: string
    field: string
    type: string
    props?: Record<string, any>
    rules?: Record<string, any>
    span?: number
    [key: string]: any
}