import React, { useEffect, useState } from "react"
import { usePopper } from "react-popper"
import List from "./List"
// import { debounce } from "../utilities/utilities"
import useClickAwayListener from "../hooks/useClickAwayListener"

// i wanted to try to make customLabel required IF T !== string
// but i couldn't figure out how to do it/ran out of time
interface IAutocompleteProps<T> {
  isDisabled?: boolean
  data: T[]
  placeHolder?: string
  label?: string
  customLabel?: (item: T) => string
  renderOption?: (item: T) => React.ReactNode
}
export interface SelectedItem<T> {
  id?: string
  isSelected: boolean
  value: T
}

const Autocomplete = <T,>(props: IAutocompleteProps<T>) => {
  const {
    data: mockData,
    isDisabled = false,
    placeHolder,
    label,
    customLabel,
    renderOption
  } = props
  const [referenceElement, setReferenceElement] =
    useState<HTMLInputElement | null>(null)
  const [dropDownElement, setDropDownElement] =
    useState<HTMLUListElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  )
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const [searchVal, setSearchVal] = useState<string>("")
  const [filteredList, setFilteredList] = useState<SelectedItem<T>[]>([])
  const [selectedOptions, setSelectedOptions] = useState<SelectedItem<T>[]>([])
  const [openPopper, setOpenPopper] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }]
  })

  useEffect(() => {
    const initialList = mockData.map((value) => {
      return { isSelected: false, value }
    })
    setFilteredList(initialList)
    setSelectedOptions(initialList)
    setIsLoading(false)
  }, [mockData])

  // there seems to be some delay when clicking on the input...
  useClickAwayListener([referenceElement, dropDownElement] as Element[], () =>
    setOpenPopper(false)
  )

  const filterList = (
    // list: string[],
    list: SelectedItem<T>[],
    target: string
    // customFilter: (...args: unknown[]) => boolean
  ) => {
    if (!list || !list.length) return

    const regex = new RegExp(`.*${target}.*`)
    // const newList = list.filter(({ value }) => {
    //   value.trim()
    //   regex.test(value)
    // })
    // const newList = list.filter((value) => {
    //   value.trim()
    //   regex.test(value)
    // })
    try {
      if (typeof list[0].value !== "string") throw new Error()
      const newList = list.filter(({ value }) => {
        value.trim()
        return regex.test(value.trim())
      })
      setFilteredList(newList)
      setIsLoading(false)
    } catch (err) {
      alert(err)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "ArrowUp") {
      setHighlightedIndex(
        (prev) => (prev - 1 + filteredList.length) % filteredList.length
      )
    } else if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) => (prev + 1) % filteredList.length)
    } else if (e.key === "Enter") {
      handleClick(highlightedIndex)
    } else if (e.key === "Escape") {
      setOpenPopper(false)
    }
  }

  const handleClick = (index: number) => {
    const newList = [...filteredList]
    newList[index].isSelected = !newList[index].isSelected
    setHighlightedIndex(index)
    setFilteredList(newList)
  }

  // tried declaring and calling debounce from elsewhere but didn't work
  // ran out of time so just used this
  useEffect(() => {
    let timer: number
    const debounce = (fn, delay) => {
      // let timer
      return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          fn(...args)
        }, delay)
      }
    }

    const debouncedFilterList = debounce(filterList, 500)

    debouncedFilterList(selectedOptions, searchVal)

    return () => {
      clearTimeout(timer)
    }
  }, [searchVal, selectedOptions])

  return (
    <>
      {/* <div>
        {filteredList.map((item) =>
          item.isSelected ? <div>{item.value}</div> : null
        )}
      </div> */}
      <label htmlFor="autocomplete-label">{label}</label>
      <input
        type="text"
        ref={setReferenceElement}
        disabled={isDisabled}
        placeholder={placeHolder}
        onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<Element>)}
        // value={searchVal}
        // onChange={(e) =>
        // 	debounce(() => {
        // 		setSearchVal(e.target.value)
        // 	})
        // }
        // onChange={(e) => debounceTest(setSearchVal(e.target.value))}
        onChange={(e) => {
          setIsLoading(true)
          setSearchVal(e.target.value)
        }}
        onClick={() => setOpenPopper(true)}
      />
      {/* <button onClick={() => setSearchVal("5353")}>Test</button> */}

      {openPopper ? (
        <>
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            {/* {isLoading ? "...loading" : null} */}
            <List
              isLoading={isLoading}
              customLabel={customLabel}
              renderOption={renderOption}
              // list={filteredList.map(({ value }) => value)}
              highlightIndex={highlightedIndex}
              list={filteredList}
              handleClick={handleClick}
              handleKeyDown={handleKeyDown}
              setDropDownElement={setDropDownElement}
            />
            <div ref={setArrowElement} style={styles.arrow} />
          </div>
        </>
      ) : null}
    </>
  )
}

export default Autocomplete
