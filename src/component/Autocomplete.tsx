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
  synchronous?: boolean
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
    synchronous = false,
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
    console.log("this is running")
    setSelectedOptions(initialList)
    setIsLoading(false)
  }, [mockData])

  // there seems to be some delay when clicking on the input...
  useClickAwayListener([referenceElement, dropDownElement] as Element[], () =>
    setOpenPopper(false)
  )
  console.log("filteredList", filteredList)
  console.log("selectedOptions", selectedOptions)
  const filterList = (list: SelectedItem<T>[], target: string) => {
    if (!list || !list.length) return

    const regex = new RegExp(`.*${target}.*`)
    try {
      if (typeof list[0].value !== "string") {
        if (customLabel) {
          // const customList = list?.map((selectedItem) => {
          //   // deep clone not actually needed but i'll keep it
          //   // since separating variables like this is maybe more readable(?)
          //   const isSelected = selectedItem.isSelected
          //   const deepClone = structuredClone(selectedItem.value)
          //   return { isSelected, value: customLabel(deepClone) }
          // })
          // const newList = customList.filter(({ value }) => {
          //   value.trim()
          //   return regex.test(value.trim())
          // })
          console.log("list", list)
          const customList = list?.reduce((accumulator, selectedItem) => {
            const isSelected = selectedItem.isSelected
            const deepClone = structuredClone(selectedItem.value)
            const value = customLabel(deepClone)

            if (regex.test(value.trim())) {
              accumulator.push({ isSelected, value })
            }

            return accumulator
          }, [] as { isSelected: boolean; value: string }[])
          setFilteredList(customList as SelectedItem<T>[])
          // setFilteredList(newList as SelectedItem<T>[])
          setIsLoading(false)
        } else {
          throw new Error()
        }
      } else {
        const newList = list.filter(({ value }) => {
          value.trim()
          return regex.test(value.trim())
        })
        setFilteredList(newList)
        setIsLoading(false)
      }
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
    const newList = [...selectedOptions]

    newList[index].isSelected = !newList[index].isSelected
    setHighlightedIndex(index)

    // this is some messy spaghetti set state logic
    setSelectedOptions(newList)
    filterList(newList, searchVal)
  }

  // tried declaring and calling debounce from elsewhere but didn't work
  // ran out of time so just used this
  useEffect(() => {
    if (synchronous) {
      let timer: number
      const debounce = (fn, delay) => {
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
    } else {
      filterList(selectedOptions, searchVal)
    }
  }, [searchVal, selectedOptions])
  return (
    <>
      <label htmlFor="autocomplete-label">{label}</label>
      <input
        type="text"
        ref={setReferenceElement}
        disabled={isDisabled}
        placeholder={placeHolder}
        onKeyDown={(e) => handleKeyDown(e as React.KeyboardEvent<Element>)}
        onChange={(e) => {
          setIsLoading(true)
          setSearchVal(e.target.value)
        }}
        onClick={() => setOpenPopper(true)}
      />
      {openPopper ? (
        <>
          <div
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
          >
            <List
              isLoading={isLoading}
              customLabel={customLabel}
              renderOption={renderOption}
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
