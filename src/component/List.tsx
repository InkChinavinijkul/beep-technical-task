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

// the way i handled renderOption is pretty awkward
// the way i had to handle customLabel is even more awkward
// but it wouldn't work otherwise. feedback certainly appreciated
const List = <T,>(props: IListProps<T>) => {
  const {
    list,
    highlightIndex,
    setDropDownElement,
    customLabel,
    renderOption,
    isLoading,
    handleClick,
    handleKeyDown
  } = props

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
            tabIndex={index}
            onClick={() => handleClick(index)}
            className={`${
              highlightIndex === index && item.isSelected
                ? "bg-orange-900 hover:bg-orange-900"
                : highlightIndex === index
                ? "bg-sky-900"
                : item.isSelected
                ? "bg-orange-500 hover:bg-orange-900"
                : "bg-sky-500 hover:bg-sky-900"
            } focus:outline-none p-1 w-24`}
          >
            {/* {customLabel
              ? (customLabel(item.value) as React.ReactNode)
              : (item.value as React.ReactNode)} */}
            {item.value as React.ReactNode}
          </li>
        )
      )}
    </ul>
  )
}

export default List
