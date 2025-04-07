import type { FormItem } from './types'
import { h, defineComponent } from 'vue'

import FormBuilder from './FormBuilder.vue'

export interface BuilderOptions {
  formItems: FormItem[]
  rules?: Record<string, any>
  formConfig?: Record<string, any>
}

export function useFormBuilder(options: BuilderOptions) {
  const { formItems, rules, formConfig } = options

  const Form = defineComponent((props: { modelValue: Record<string, any> }, { attrs, slots }) => {
    return () =>
      h(
        FormBuilder,
        {
          formItems,
          rules,
          formConfig,
          ...props,
          ...attrs,
        },
        slots,
      )
  })

  return {
    Form,
  }
}
