<script setup lang="ts">
import { ElFormItem } from 'element-plus'

import { ref, computed, watchEffect } from 'vue'

import type { FormItem } from './types'
import { getComponent } from './util'

interface Props {
  formItem: FormItem
}

const props = defineProps<Props>()

const fieldValue = defineModel<any>({
  default: () => undefined
})

// 动态的 show
const formVisible = computed(() => {
  return props.formItem.dynamics?.show?.() ?? true
})

// 动态的 options
const dynamicsOptions = ref<Record<string, any>[]>([])
watchEffect(async () => {
  dynamicsOptions.value = await props.formItem.dynamics?.options?.() || []
})

const selectType = ['select', 'datePicker', 'timePicker']
const formProps = computed(() => {
  const _props: Record<string, any> = { ...props.formItem.props }

  if (!('placeholder' in _props)) {
    _props.placeholder = selectType.includes(props.formItem.type) ? '请选择' : '请输入'
  }

  // 动态的 disabled
  _props.disabled = _props.disabled || props.formItem.dynamics?.disabled?.()

  // 动态的 options
  if (_props.options) {
    _props.options = [..._props.options, ...dynamicsOptions.value]
  }

  return {
    ..._props,
    modelValue: fieldValue.value,
    'onUpdate:modelValue': (val: string) => (fieldValue.value = val)
  }
})
</script>

<template>
  <el-form-item v-if="formVisible" :label="formItem.label" :prop="formItem.field" :rules="formItem.rules">
    <component :is="getComponent(formItem.type)" v-bind="formProps">
      <template v-for="(slot, name) in formItem.slots" #[name]="scope">
        <slot :name="name" v-bind="scope">
          <component :is="slot" />
        </slot>
      </template>
    </component>
  </el-form-item>
</template>

<style scoped></style>