<script setup lang="ts">
import { useFormBuilder, useResetableRef } from '~/func';
import { promiseTimeout } from '~/shared'
import { h } from 'vue'
import { ElInput } from 'element-plus'

const [formData, reset] = useResetableRef<Record<string, any>>({
  name: '',
  type: 1,
  used: 'yes'
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
      props: {
        type: 'number'
      },
      dynamics: {
        disabled() {
          return !formData.value.name
        }
      },
      slots: {
        append: () => [h('span', '岁')],
      },
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
        onChange() {
          formData.value.hobby = undefined
        }
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
          },
        ],
      },
      dynamics: {
        disabled() {
          return formData.value.used == 'no'
        },
        async options() {
          const ops = await getSexHobbys(formData.value.sex)
          return ops
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
      field: 'remark',
      label: '备注',
      type: ElInput,
      props: {
        type: 'textarea',
        row: 3
      },
      span: 24
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

function getSexHobbys(value: number) {
  return promiseTimeout<Record<string, any>[]>((resolve) => {
    const result = []
    if (value == 1) {
      result.push({
        label: '足球',
        value: 4
      })
    }
    resolve(result)
  }, 300)
}
</script>

<template>
  <section class="form-container">
    <Form v-model="formData" style="max-width: 880px;">
      <template #footer="{ validate }">
        <div style="text-align: center;margin-top: 24px;">
          <el-button @click="submit(validate)">提交</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </template>
    </Form>
  </section>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
