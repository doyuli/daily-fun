import {
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElTimePicker,
  ElSwitch,
  ElCheckboxGroup,
  ElCheckbox,
  ElRadio,
  ElRadioGroup,
} from 'element-plus'
import { h, type Component } from 'vue'

const CompMap = new Map<string, Component>([
  ['input', ElInput],
  ['select', transformSubOption(ElSelect, ElOption)],
  ['radio', transformSubOption(ElRadioGroup, ElRadio)],
  ['checkbox', transformSubOption(ElCheckboxGroup, ElCheckbox)],
  ['datePicker', ElDatePicker],
  ['timePicker', ElTimePicker],
  ['switch', ElSwitch],
])

function transformSubOption(comp: Component, subComp: Component): Component {
  return (props, { attrs }) => {
    const { options, ..._props } = { ...props, ...attrs }
    return h(
      comp,
      {
        ..._props,
      },
      {
        default: () => options?.map((v: Record<string, any>) => h(subComp, { ...v })),
      },
    )
  }
}

export function getComponent(type: string | Component): Component {
  if (typeof type !== 'string') return type
  return CompMap.get(type) || ElInput
}
