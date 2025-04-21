// @ts-ignore
Function.prototype.myBind = function (thisArg, ...args) {
  const _this = this
  // bind 需要支持 new
  const bindFn = function (...innerArgs: any[]) {
    _this.apply(thisArg || window, [...args, ...innerArgs])
  }
  bindFn.prototype = this.prototype

  return bindFn
}

// @ts-ignore
Function.prototype.myApply = function (thisArg, args: any[]) {
  const context = thisArg || window
  const id = Symbol()
  context[id] = this
  const result = context[id](...args)
  delete context[id]
  return result
}

// @ts-ignore
Function.prototype.myCall = function (thisArg, ...args: any[]) {
  const context = thisArg || window
  const id = Symbol()
  context[id] = this
  const result = context[id](...args)
  delete context[id]
  return result
}
