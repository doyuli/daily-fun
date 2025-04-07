<script setup lang="ts">
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus'

import { h, ref } from 'vue'

import type { FormItem } from './types'
import { getComponent } from './util'

interface Props {
  formItems: FormItem[],
  rules?: Record<string, any>
  formConfig?: Record<string, any>
  span?: number
  [key: string]: any
}

const { formItems = [], formConfig = { labelWidth: 'auto' }, rules = {}, span = 24 } = defineProps<Props>()

const formRef = ref()

const formData = defineModel<Record<string, any>>({
  default: () => { }
})

const selectType = ['select']
function getFormItemComp(item: FormItem) {
  const props: Record<string, any> = { ...item.props, formData: formData.value }

  const tag = getComponent(item.type)

  if (!('placeholder' in props)) {
    props.placeholder = selectType.includes(item.type) ? '请选择' : '请输入'
  }

  return () => h(
    tag,
    {
      ...props,
      modelValue: formData.value[item.field],
      'onUpdate:modelValue': (val: string) => (formData.value[item.field] = val)
    },
  )
}

/**
 * 验证表单
 */
function validate() {
  return formRef.value?.validate()
}

defineExpose({
  validate
})
</script>

<template>
  <el-form ref="formRef" :model="formData" :rules="rules" v-bind="formConfig">
    <el-row>
      <el-col v-for="item in formItems" :key="item.field" :span="item.span || span">
        <el-form-item :label="item.label" :prop="item.field" :rules="item.rules">
          <component :is='getFormItemComp(item)' v-bind="item.props"></component>
        </el-form-item>
      </el-col>
    </el-row>
    <slot name="footer" v-bind="{ validate, formData }"></slot>
  </el-form>
</template>

<style scoped></style>