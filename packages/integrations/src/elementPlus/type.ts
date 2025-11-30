import type { TableColumnCtx } from 'element-plus'
import type { VNode } from 'vue'

export type _TableColumn = Partial<TableColumnCtx>
export type TableColumn = _TableColumn & {
  render?: (row: any) => VNode
}
