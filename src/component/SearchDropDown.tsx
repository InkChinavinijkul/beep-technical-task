import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent
} from "react"
import { createPopper, Placement } from "@popperjs/core"
const mock2 = [
  { name: "test1", value: "value1", nest: { nestVal: "nestVal1" } },
  { name: "test2", value: "value2", nest: { nestVal: "nestVal2" } },
  { name: "test3", value: "value3", nest: { nestVal: "nestVal3" } },
  { name: "test4", value: "value4", nest: { nestVal: "nestVal4" } },
  { name: "test5", value: "value5", nest: { nestVal: "nestVal5" } },
  { name: "test6", value: "value6", nest: { nestVal: "nestVal6" } }
]
interface SearchDropdownProps<T> {
  data: T[]
  onSelect: (selectedItem: T) => void
  isLoading: boolean
  onSearch: (query: string) => void
  customLabel: (item: T) => string
  inputLabel?: string
  inputDescription?: string
  synchronous?: boolean
  searchOnFocus?: boolean
  disabled?: boolean
}

const SearchDropdown = <T extends (typeof mock2)[0]>({
  data,
  onSelect,
  isLoading,
  onSearch,
  customLabel,
  inputLabel,
  inputDescription,
  synchronous = true,
  searchOnFocus = false,
  disabled = false
}: SearchDropdownProps<T>) => {
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<T[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const popperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && popperRef.current && inputRef.current) {
      createPopper(inputRef.current, popperRef.current, {
        placement: "bottom-start" as Placement
      })
    }
  }, [isOpen])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)

    if (synchronous) {
      const filteredResults = data.filter((item) =>
        customLabel(item).toLowerCase().includes(value.toLowerCase())
      )
      setResults(filteredResults)
    } else {
      onSearch(value)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && highlightedIndex > 0) {
      setHighlightedIndex(highlightedIndex - 1)
    } else if (
      event.key === "ArrowDown" &&
      highlightedIndex < results.length - 1
    ) {
      setHighlightedIndex(highlightedIndex + 1)
    } else if (event.key === "Enter" && highlightedIndex !== -1) {
      onSelect(results[highlightedIndex])
    } else if (event.key === "Escape") {
      setIsOpen(false)
    }
  }

  const handleOptionClick = (item: T) => {
    onSelect(item)
  }

  const handleClickAway = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      popperRef.current &&
      !popperRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickAway)

    return () => {
      document.removeEventListener("mousedown", handleClickAway)
    }
  }, [])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(searchOnFocus)}
        placeholder={inputLabel}
        disabled={disabled}
      />
      {isLoading && <div>Loading...</div>}
      {isOpen && results.length > 0 && (
        <div
          ref={popperRef}
          className="absolute z-10 bg-white border shadow-md"
        >
          {results.map((item, index) => (
            <div
              key={index}
              className={`p-2 cursor-pointer ${
                highlightedIndex === index ? "bg-blue-200" : ""
              }`}
              onClick={() => handleOptionClick(item)}
            >
              {customLabel(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchDropdown
