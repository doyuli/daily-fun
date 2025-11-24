import type { Component } from 'vue'
import { h, shallowRef } from 'vue'

interface AsyncComponentOptions {
  loader: () => Promise<Component>
  loadingComponent?: Component
  errorComponent?: Component
  timeout?: number
}

export function defineAsyncComponent(options: AsyncComponentOptions): Component
export function defineAsyncComponent(loader: () => Promise<Component>): Component
export function defineAsyncComponent(
  options: AsyncComponentOptions | (() => Promise<Component>),
): Component {
  if (typeof options === 'function') {
    options = {
      loader: options,
    }
  }

  const defaultComp = h('span')

  const { loader, loadingComponent = defaultComp, errorComponent = defaultComp, timeout } = options

  return {
    setup(_, { attrs, slots }) {
      const component = shallowRef<Component>(loadingComponent)

      function loadComponent() {
        return new Promise<Component>((resolve, reject) => {
          if (timeout && timeout > 0) {
            setTimeout(() => {
              reject(new Error('timeout'))
            }, timeout)
          }
          loader().then(resolve, reject)
        })
      }

      loadComponent()
        .then((comp: any) => {
          if (comp && comp[Symbol.toStringTag] === 'Module') {
            comp = comp.default
          }
          component.value = comp
        })
        .catch(() => {
          component.value = errorComponent
        })

      return () => h(component.value, attrs, slots)
    },
  }
}
