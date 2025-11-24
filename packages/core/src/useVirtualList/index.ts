import type { MaybeRef, Ref, StyleValue } from 'vue'
import { useElementSize } from '@vueuse/core'
import { computed, ref, shallowRef, toValue, watch } from 'vue'

export interface UseVirtualListOptions {
  // 视口外额外渲染的项目数量（缓冲区），防止快速滚动时白屏, 默认 5 条
  overscan?: number
  // 每条数据的高度
  itemHeight: number | ((index: number) => number)
}

// 由于实际渲染列表是动态的，需要包装一下保证 index 正确性
export interface UseVirtualListItem<T> {
  data: T
  index: number
}

export function useVirtualList<T = any>(list: MaybeRef<readonly T[]>, options: UseVirtualListOptions) {
  // 虚拟滚动的容器引用（用于监听滚动和尺寸）
  const containerRef = shallowRef<HTMLElement | null>(null)
  // 用于监听容器尺寸变化时的重新计算
  const size = useElementSize(containerRef)
  // 当前实际渲染的可见项列表
  const currentList: Ref<UseVirtualListItem<T>[]> = ref([])
  // 原始列表
  const source = shallowRef(list)
  // 当前渲染范围
  const state: Ref<{ start: number, end: number }> = ref({ start: 0, end: 10 })
  //  容器基础样式
  const containerStyle: StyleValue = { overflowY: 'auto' }

  const { itemHeight, overscan = 5 } = options

  // 计算可视区域的最大容纳量
  const getViewCapacity = (containerSize: number) => {
    // 如果传入的是 number 类型，直接计算
    if (typeof itemHeight === 'number')
      // // 实际视图最大渲染数量 = 当前盒子高度 / 每一列的高度， 并向上取整
      return Math.ceil(containerSize / itemHeight)

    // 动态高度，从当前起始位置开始累加，直到超出容器高度
    const { start = 0 } = state.value
    let sum = 0
    let capacity = 0
    for (let i = start; i < source.value.length; i++) {
      const size = itemHeight(i)
      sum += size
      capacity = i
      if (sum > containerSize)
        break
    }
    // 实际视图最大渲染数量 = 结束下标 - 开始下标
    return capacity - start
  }

  // 根据当前的滚动距离,计算出应该从哪个索引开始渲染
  const getOffset = (scrollDirection: number) => {
    if (typeof itemHeight === 'number')
      // Math.floor 向下取整 `+1` 是为了预留缓冲区，确保渲染时能多显示一项，防止滚动时出现空白
      return Math.floor(scrollDirection / itemHeight) + 1

    // 动态高度，累加高度直到超过滚动距离
    let sum = 0
    let offset = 0
    for (let i = 0; i < source.value.length; i++) {
      const size = itemHeight(i)
      sum += size
      if (sum >= scrollDirection) {
        offset = i
        break
      }
    }
    return offset + 1
  }

  // 获取实际渲染数据
  const calculateRange = () => {
    const element = containerRef.value
    if (element) {
      // 计算起始偏移量
      const offset = getOffset(element.scrollTop)
      // 计算容器最大渲染量
      const viewCapacity = getViewCapacity(element.clientHeight)
      // 开始坐标 包含缓冲区
      const from = offset - overscan
      // 结束坐标 包含缓冲区
      const to = offset + viewCapacity + overscan
      // 更新渲染范围 注意边界处理
      state.value = {
        start: from < 0 ? 0 : from,
        end: to > source.value.length
          ? source.value.length
          : to,
      }
      // 更新当前渲染列表
      currentList.value = source.value
        .slice(state.value.start, state.value.end)
        .map((ele, index) => ({
          data: ele,
          index: index + state.value.start,
        }))
    }
  }

  // 获取第 index 项距离列表顶部的累计偏移量
  const getDistanceTop = (index: number) => {
    if (typeof itemHeight === 'number') {
      const size = index * itemHeight
      return size
    }

    const size = source.value
      .slice(0, index)
      .reduce((sum, _, i) => sum + itemHeight(i), 0)

    return size
  }

  // 当前渲染块距离顶部的偏移量，用于 marginTop 占位
  const offsetTop = computed(() => getDistanceTop(state.value.start))

  // 整个列表的总高度，用于撑起滚动条
  const totalHeight = computed(() => {
    if (typeof itemHeight === 'number')
      return source.value.length * itemHeight

    return source.value.reduce((sum, _, index) => sum + itemHeight(index), 0)
  })

  watch([size.width, size.height, () => toValue(list), containerRef], () => {
    calculateRange()
  })

  // 滚动到指定索引项的位置
  const scrollTo = (index: number) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = getDistanceTop(index)
      calculateRange()
    }
  }

  // 外层盒子的样式
  const wrapperProps = computed(() => {
    return {
      style: {
        width: '100%',
        height: `${totalHeight.value - offsetTop.value}px`,
        marginTop: `${offsetTop.value}px`,
      },
    }
  })

  return {
    list: currentList,
    scrollTo,
    containerProps: {
      ref: containerRef,
      onScroll: () => {
        calculateRange()
      },
      style: containerStyle,
    },
    wrapperProps,
  }
}
