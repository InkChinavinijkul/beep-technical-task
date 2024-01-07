// any is fine here because we're literally expecting any functions
// we're just trying to delay its execution in the debouncer
// admittedly I also don't know what the alternatives are for doing this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunction = (...args: any[]) => any | void

export const debounce = (genFn: GenericFunction, delay = 500) => {
  let timer: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      genFn(...args)
    }, delay)
  }
}
