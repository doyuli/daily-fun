import { invokeCodeSnippet } from './sandbox'

export function compileTemplate(template: string, context: Record<string, any>) {
  let error = ''
  let result = ''

  try {
    result = template.replace(/\{\{(.*?)\}\}/g, (_, snippet) => {
      const value = invokeCodeSnippet(snippet, context)
      return value
    })
  }
  catch (err: any) {
    error = err.message
  }

  return { result, error }
}

export {
  invokeCodeSnippet,
}
