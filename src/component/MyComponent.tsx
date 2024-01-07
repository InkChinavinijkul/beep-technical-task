import React, { useState } from "react"
import SearchDropdown from "./SearchDropDown"
// import SearchDropdown from "./SearchDropdown" // Adjust the import path based on your project structure

interface Item {
  id: number
  name: string
}

const mock2 = [
  { name: "test1", value: "value1", nest: { nestVal: "nestVal1" } },
  { name: "test2", value: "value2", nest: { nestVal: "nestVal2" } },
  { name: "test3", value: "value3", nest: { nestVal: "nestVal3" } },
  { name: "test4", value: "value4", nest: { nestVal: "nestVal4" } },
  { name: "test5", value: "value5", nest: { nestVal: "nestVal5" } },
  { name: "test6", value: "value6", nest: { nestVal: "nestVal6" } }
]

const MyComponent = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = async (query: string) => {
    // Simulating an asynchronous API call
    setLoading(true)
    // Replace the following line with your actual API call
    // const response = await fetch(`https://api.example.com/search?q=${query}`)
    // const data = await response.json()
    setLoading(false)
    return mock2
  }

  const customLabel = (item: Item) => item.name

  const handleSelect = (item: Item) => {
    setSelectedItem(item)
  }

  return (
    <div>
      <h1>Search Dropdown Example</h1>
      <SearchDropdown
        data={mock2} // Replace with your actual data
        onSelect={handleSelect}
        isLoading={loading}
        onSearch={fetchData}
        customLabel={customLabel}
        inputLabel="Search"
        inputDescription="Type to search"
        synchronous={false} // Set to true for synchronous searching
        searchOnFocus={false}
        disabled={false}
      />
      {selectedItem && (
        <div>
          <h2>Selected Item</h2>
          <p>ID: {selectedItem.id}</p>
          <p>Name: {selectedItem.name}</p>
        </div>
      )}
    </div>
  )
}

export default MyComponent
