// any is fine here because we're literally expecting any functions
// we're just trying to delay its execution in the debouncer
// admittedly I also don't know what the alternatives are for doing this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericFunction = (...args: any[]) => any | void

export const debounce = (genFn: GenericFunction, delay = 500) => {
  let timer: number
  console.log("debouncer here")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    console.log("before clear")
    clearTimeout(timer)
    console.log("debouncer there")
    timer = setTimeout(() => {
      genFn(...args)
    }, delay)
    console.log(`ran after ${timer} milliseconds`)
  }
}

export const debounceTest = (genFn: GenericFunction, delay = 500) => {
  let timer: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      genFn(...args)
    }, delay)
    // console.log(`ran after ${timer} milliseconds`)
  }
}

export const debounce3 = <T extends (...args: any[]) => any>(
  callback: T,
  waitFor = 500
) => {
  let timeout = 0
  return (...args: Parameters<T>): ReturnType<T> => {
    let result: any
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      result = callback(...args)
    }, waitFor)
    return result
  }
}

// const debounceLoading = (genFn: GenericFunction, delay = 500) => {}

export function debounceGood<Params extends any[]>(
  func: (...args: Params) => any,
  timeout = 500
): (...args: Params) => void {
  let timer: number
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
