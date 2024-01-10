import "./App.css"
import Autocomplete from "./component/Autocomplete"

const mockData = ["test1", "test2", "test3", "test4", "      fdsfsdf      2222"]
interface Mock2 {
  name: string
  value: string
  nest: { nestVal: string }
}
const mock2: Mock2[] = [
  { name: "test1", value: "value1", nest: { nestVal: "nestVal1" } },
  { name: "test2", value: "value2", nest: { nestVal: "nestVal2" } },
  { name: "test3", value: "value3", nest: { nestVal: "nestVal3" } },
  { name: "test4", value: "value4", nest: { nestVal: "nestVal4" } },
  { name: "test5", value: "value5", nest: { nestVal: "nestVal5" } },
  { name: "test6", value: "value6", nest: { nestVal: "nestVal6" } }
]

function App() {
  return (
    <div>
      <Autocomplete
        data={mockData}
        placeHolder={"Search..."}
        label={"Search Things"}
        // customLabel={(item) => {
        //   return item.name
        // }}
        // customLabel={(item) => item + "123"}
        // renderOption={(item) => <p>{item + "123"}</p>}
      />
    </div>
  )
}

export default App
