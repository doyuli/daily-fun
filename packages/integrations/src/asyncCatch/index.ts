import type { NodePath } from 'babel__traverse'
import { generate } from '@babel/generator'
import { parse } from '@babel/parser'
import _traverse from '@babel/traverse'
import * as T from '@babel/types'

const traverse = typeof _traverse === 'function' ? _traverse : ((_traverse as any).default as typeof _traverse)

export interface Options {
  /**
   * catch 块中执行的代码
   * @default console.error(e)
   */
  catchCode?: string | ((identifier: string) => string)
  /**
   * catch 参数名
   * @default e
   */
  identifier?: string
  /**
   * 可选的 finally 块代码
   */
  finallyCode?: string
}

export function compile(
  code: string,
  options?: Options,
) {
  const {
    identifier = 'e',
    catchCode: _catchCode = `console.error(${identifier})`,
    finallyCode,
  } = options || {}

  const catchCode = typeof _catchCode === 'function' ? _catchCode(identifier) : _catchCode

  const catchStatement = parse(catchCode).program.body
  const finallyStatement = finallyCode ? parse(finallyCode).program.body : null

  const ast = parse(code, {
    sourceType: 'module',
    plugins: [
      'asyncGenerators',
      'classProperties',
      'dynamicImport',
      'optionalChaining',
    ],
  })

  const asyncFuncBodies = new Set<NodePath<T.BlockStatement>>()

  traverse(ast, {
    AwaitExpression(path) {
      // 如果已在 try...catch 内，跳过
      if (path.findParent(path => T.isTryStatement(path.node)))
        return

      let parent: any = path.parentPath
      while (parent && !isAsyncFunction(parent)) {
        parent = parent.parentPath
      }

      if (parent && T.isBlockStatement(parent.get('body').node)) {
        asyncFuncBodies.add(parent.get('body'))
      }
    },
  })

  for (const bodyPath of asyncFuncBodies) {
    const originalBody = bodyPath.node.body

    const tryBlock = T.blockStatement([...originalBody])
    const catchParam = T.identifier(identifier)
    const catchBlock = T.blockStatement([...catchStatement])

    const finallyBlock = finallyStatement ? T.blockStatement([...finallyStatement]) : null

    const tryStmt = T.tryStatement(tryBlock, T.catchClause(catchParam, catchBlock), finallyBlock)

    // 替换整个函数体为 [tryStmt]
    bodyPath.node.body = [tryStmt]
  }

  return generate(ast, { compact: false }, code).code
}

function isAsyncFunction(path: NodePath): boolean {
  const node = path.node
  return (
    (T.isFunctionDeclaration(node) && node.async)
    || (T.isFunctionExpression(node) && node.async)
    || (T.isArrowFunctionExpression(node) && node.async)
    || (T.isObjectMethod(node) && node.async)
    || (T.isClassMethod(node) && node.async)
  )
}
