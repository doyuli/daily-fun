<script setup lang="ts">
import { defineTableBuilder } from '@daily-fun/integrations/elementPlus'
import { ElSwitch } from 'element-plus'
import { h, shallowRef } from 'vue'
import 'element-plus/dist/index.css'

const status = shallowRef(true)

const tableBuilder = defineTableBuilder({
  columns: [
    {
      prop: 'date',
      label: 'Date',
      width: '180',
      render: ({ row }) => {
        return h('div', { class: '212', style: row.name === 'Tom1' ? 'color:red' : '' }, `日期：${row.date}`)
      },
    },
    {
      prop: 'name',
      label: 'Name',
      width: '180',
    },
    {
      prop: 'address',
      label: 'Address',
      render: () => {
        return h(ElSwitch, { 'modelValue': status.value, 'onUpdate:modelValue': (val: any) => status.value = val })
      },
    },
  ],
})

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom1',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom2',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom3',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<template>
  <div>
    <tableBuilder :data="tableData">
      <template #name="scope">
        姓名：{{ scope.row.name }}
      </template>
      <!-- <template #address>
        <ElSwitch v-model="status" />
      </template> -->
    </tableBuilder>
  </div>
</template>
