import React, { useEffect, useRef, useState } from "react"
import { usePopper } from "react-popper"
import List from "./List"
import {
  debounce,
  debounce3,
  debounceGood,
  debounceTest
} from "../utilities/utilities"
import useClickAwayListener from "../hooks/useClickAwayListener"
import { useDebounce } from "../hooks/useDebounce"
// *********TODO**********
// 1. List Customization
//    to allow for customization you can simply create a prop in List that "takes in"
//    some kind of list and if that function is included then that's how the list would be
//    customized. Would also have to set a return type for this. JSX.Element could work
//    or could probably do it as JSX.Element if we have ul outside of it
// 2. isLoading
// 3. clicking on ul or li should not close drop down
interface IAutocompleteProps<T> {
  // data: string[]
  isDisabled?: boolean
  data: T[]
  // data: string[]
  placeHolder?: string
  label?: string
  // customLabel?: T extends string
  //   ? (item: string) => string
  //   : (item: T) => string
  customLabel?: (item: T) => string
  renderOption?: (item: T) => React.ReactNode
  // searchKey: keyof T
}
export interface SelectedItem<T> {
  id?: string
  isSelected: boolean
  value: T // string for now
  // value: string // string for now
  nestedStuff?: unknown
}

// const mockDataObject = {

// }
const delay = 500

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
  // const [fetchedData, setFetchedData] = useState<string[]>([])
  const [filteredList, setFilteredList] = useState<SelectedItem<T>[]>([])
  const [selectedOptions, setSelectedOptions] = useState<SelectedItem<T>[]>([])
  // const [filteredList, setFilteredList] = useState<SelectedItem[]>([])
  // const [selectedList, setSelectedList] = useState<SelectedItem[]>([])
  const [openPopper, setOpenPopper] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }]
  })

  // simulate data fetching
  // useEffect(() => {
  //   // const test = async () => {

  //   setTimeout(() => {
  //     // setFilteredList(
  //     //   mockData.map((value) => {
  //     //     return { isSelected: false, value }
  //     //   })
  //     // )
  //     setFetchedData(mockData)
  //     // setIsLoading(false)
  //   }, 2000)
  //   // }
  //   // await test()
  //   // return () => {
  //   //   setIsLoading(false)
  //   // }
  //   // const test = async () => {
  //   //   const ex = () => {
  //   //     setFilteredList(mockData)
  //   //     setIsLoading(false)
  //   //   }
  //   //   // Simulating data fetching with a delay
  //   //   await new Promise((resolve) => setTimeout(resolve, 2000))
  //   //   await ex()
  //   //   // Once the delay is over, update the state with the mock data

  //   //   // Set isLoading to false after data is fetched
  //   // }
  //   // test()
  // }, [])
  useEffect(() => {
    const initialList = mockData.map((value) => {
      return { isSelected: false, value }
    })
    setFilteredList(initialList)
    setSelectedOptions(initialList)
    setIsLoading(false)
    // filterList(
    //   fetchedData.map((value) => {
    //     return { isSelected: false, value }
    //   }),
    //   ""
    // )
  }, [mockData])

  console.log(filteredList)
  // console.log("fetched", fetchedData)
  // there seems to be some delay when clicking on the input...
  useClickAwayListener([referenceElement, dropDownElement] as Element[], () =>
    setOpenPopper(false)
  )

  // useEffect(() => {
  // 	const debouncer = debounce(() => alert("hello"))
  // 	debouncer()
  // }, [searchVal])
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
    const newList = list.filter(({ value }) => {
      value.trim()
      return regex.test(value.trim())
    })
    setFilteredList(newList)
    setIsLoading(false)
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
  // console.log("idx", highlightedIndex)
  const handleClick = (index: number) => {
    const newList = [...filteredList]
    newList[index].isSelected = !newList[index].isSelected
    setHighlightedIndex(index)
    setFilteredList(newList)
  }
  // const debouncedValue = useDebounce(filterList)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // setIsLoading(true)
  //     filterList(mockData, searchVal)
  //   }, delay || 500)

  //   return () => {
  //     // setIsLoading(false)
  //     clearTimeout(timer)
  //   }
  // }, [searchVal, filteredList])

  // useEffect(() => {
  //   const debouncer = debounce(() => filterList(mockData, searchVal))
  //   // const timer = setTimeout(() => {
  //   //   filterList(mockData, searchVal)
  //   // }, delay || 500)

  //   // return () => {
  //   //   clearTimeout(timer)
  //   // }
  //   debouncer()
  // }, [searchVal])
  // useEffect(() => {
  //   const debouncer = debounceGood(filterList)
  //   debouncer(mockData, searchVal)
  // }, [searchVal])
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
    // Create a debounced version of filterList
    const debouncedFilterList = debounce(filterList, 500)

    // Call the debounced function when searchVal changes
    debouncedFilterList(selectedOptions, searchVal)
    console.log("hello?")

    // Cleanup function
    return () => {
      clearTimeout(timer)
    }
  }, [searchVal, selectedOptions])

  return (
    <>
      <div>
        {filteredList.map((item) =>
          item.isSelected ? <div>{item.value}</div> : null
        )}
      </div>
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
