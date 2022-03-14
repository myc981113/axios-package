export const debounce = (func : any, timeout : number, immediate : boolean) => {
  let timer : number
  let callNow : any

  return function () {
    const _this = this
    const args = arguments

    timer && clearTimeout(timer)
    if(immediate) {
      callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, timeout)
      callNow && func(_this, args)
    } 
  }
}