import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import Autocomplete from "./component/Autocomplete"
import SearchDropDown from "./component/SearchDropDown"
import MyComponent from "./component/MyComponent"
const mockData = ["test1", "test2", "test3", "test4", "      fdsfsdf      2222"]
const mock2 = [
  { name: "test1", value: "value1", nest: { nestVal: "nestVal1" } },
  { name: "test2", value: "value2", nest: { nestVal: "nestVal2" } },
  { name: "test3", value: "value3", nest: { nestVal: "nestVal3" } },
  { name: "test4", value: "value4", nest: { nestVal: "nestVal4" } },
  { name: "test5", value: "value5", nest: { nestVal: "nestVal5" } },
  { name: "test6", value: "value6", nest: { nestVal: "nestVal6" } }
]

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Autocomplete
        data={mock2}
        // searchKey={"namfde"}
        placeHolder={"Search..."}
        label={"Search Things"}
        // searchKey={"name"}
      />
      {/* <SearchDropDown
        customLabel={() => "test"}
        data={mock2}
        onSearch={}
        onSelect={}
      /> */}
      {/* <MyComponent /> */}
    </div>
  )
}

export default App
