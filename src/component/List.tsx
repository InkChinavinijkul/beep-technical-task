import { useEffect, useRef } from "react"
import { SelectedItem } from "./Autocomplete"

interface IListProps<T> {
  list: SelectedItem<T>[]
  isLoading: boolean
  highlightIndex: number
  setDropDownElement: React.Dispatch<
    React.SetStateAction<HTMLUListElement | null>
  >
  customLabel?: (item: T) => string
  renderOption?: (item: T) => React.ReactNode
  handleClick: (index: number) => void
  handleKeyDown: (e: React.KeyboardEvent<Element>) => void
}

// const createCustomList = <L, T,>(list: L[], ref: React.MutableRefObject<T | null>) : T | T[] => {

// }

const List = <T,>(props: IListProps<T>) => {
  const {
    list,
    highlightIndex,
    setDropDownElement,
    customLabel,
    renderOption,
    isLoading,
    handleClick,
    handleKeyDown,
    customList
  } = props
  // const focusedEl = useRef<HTMLLIElement | null>(null)
  // useEffect(() => {
  //   if (focusedEl) {
  //     focusedEl.current?.focus()
  //   }
  // }, [])
  return isLoading ? (
    <div>Loading...</div>
  ) : !list.length ? (
    <div>No results</div>
  ) : (
    <ul
      className={`list-none`}
      ref={setDropDownElement}
      onKeyDown={handleKeyDown}
    >
      {list.map((item, index) =>
        renderOption ? (
          renderOption(item.value)
        ) : (
          <li
            // autoFocus={!index}
            tabIndex={index}
            // ref={!index ? focusedEl : undefined}
            // onClick={(e) => (focusedEl.current = e.currentTarget)}
            onClick={() => handleClick(index)}
            // className={`bg-sky-500 hover:bg-sky-900 focus:ring focus:ring-violet-300 focus:bg-sky-900 p-1 w-24 ${
            //   item.isSelected ? "bg-orange-500" : ""
            // }`}
            // onKeyDown={handleKeyDown}
            // ${item.isSelected ? "bg-orange-500" : ""}`}
            className={`${
              highlightIndex === index && item.isSelected
                ? "bg-orange-900"
                : highlightIndex === index
                ? "bg-sky-900"
                : item.isSelected
                ? "bg-orange-500"
                : "bg-sky-500"
            } focus:outline-none hover:bg-sky-900 p-1 w-24`}
          >
            {customLabel
              ? (customLabel(item.value) as React.ReactNode)
              : (item.value as React.ReactNode)}
            {/* {typeof item.value === "string"
              ? (item.value as React.ReactNode)
              : null} */}
          </li>
        )
      )}
    </ul>
  )
}

export default List
