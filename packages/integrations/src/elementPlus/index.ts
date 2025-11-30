import type { Component } from 'vue'
import type { TableColumn } from './type'
import { ElTable, ElTableColumn } from 'element-plus'
import { h } from 'vue'

interface TableBuilderOptions {
  columns: TableColumn []
}

export function defineTableBuilder(options: TableBuilderOptions): Component {
  const { columns } = options
  return {
    props: ['data'],
    setup(props, { slots }) {
      return () => h(
        ElTable,
        { data: props.data },
        () => columns.map((column) => {
          const { render, ...columnProps } = column
          const slot = render ?? slots[column.prop!] ?? null as any
          return h(ElTableColumn, columnProps as any, slot)
        }),
      )
    },
  }
}
