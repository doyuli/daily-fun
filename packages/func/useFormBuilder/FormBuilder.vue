<script setup lang="ts">
import type { FormItem } from './types'
import { ElForm, ElRow, ElCol } from 'element-plus'
import { ref } from 'vue'

import FormItemContent from "./FormItem.vue";

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
        <FormItemContent v-model="formData[item.field]" :formItem="item" />
      </el-col>
    </el-row>
    <slot name="footer" v-bind="{ validate, formData }"></slot>
  </el-form>
</template>

<style scoped></style>