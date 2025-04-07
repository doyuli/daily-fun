<script setup lang="ts">
import { useFormBuilder, useResetableRef } from '~/func';

const [formData, reset] = useResetableRef<Record<string, any>>({
  name: '',
  type: 1
})

const { Form } = useFormBuilder({
  formConfig: {
    labelWidth: 'auto'
  },
  formItems: [
    {
      field: 'name',
      label: '姓名',
      type: 'input',
      span: 24
    },
    {
      field: 'age',
      label: '年龄',
      type: 'input',
      span: 12
    },
    {
      field: 'sex',
      label: '性别',
      type: 'select',
      props: {
        clearable: true,
        options: [
          {
            label: '男',
            value: 1
          },
          {
            label: '女',
            value: 2
          }
        ],
      },
      span: 12
    },
    {
      field: 'brith',
      label: '出生年月',
      type: 'datePicker',
      props: {
        style: {
          width: '100%'
        },
        clearable: true,
        type: 'month',
        valueFormat: 'YYYY-MM-DD'
      },
      rules: { required: true, message: 'Please input brith', trigger: 'change' },
      span: 12
    },
    {
      field: 'hobby',
      label: '爱好',
      type: 'checkbox',
      props: {
        disabled: false,
        options: [
          {
            label: '篮球',
            value: 1
          },
          {
            label: '羽毛球',
            value: 2
          },
          {
            label: '乒乓球',
            value: 3
          }
        ],
      },
      dynamics: {
        disabled() {
          return formData.value.sex == 1
        },
        options() {
          return formData.value.sex == 1 ? [
            {
              label: '足球',
              value: 4
            }
          ] : []
        },
        show() {
          return formData.value.age > 18
        }
      },
      span: 12
    },
    {
      field: 'type',
      label: '类型',
      type: 'radio',
      props: {
        options: [
          {
            label: '好的',
            value: 1
          },
          {
            label: '坏的',
            value: 2
          },
        ],
      },
      span: 12
    },
    {
      field: 'used',
      label: '可用',
      type: 'switch',
      props: {
        activeValue: 'yes',
        inactiveValue: 'no'
      },
      span: 12
    },
  ],
  rules: {
    name: [
      { required: true, message: 'Please input name', trigger: 'blur' },
    ],
  }
})

async function submit(validate: Function) {
  await validate()
  console.log(formData.value);
}
</script>

<template>
  <main style="max-width: 800px;">
    <Form v-model="formData">
      <template #footer="{ validate }">
        <div style="text-align: center;margin-top: 24px;">
          <el-button @click="submit(validate)">提交</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </template>
    </Form>
  </main>
</template>
