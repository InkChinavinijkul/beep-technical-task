import { useEffect } from "react"

// gotta switch this to Element[] or something
const useClickAwayListener = (refs: Element[] | null, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!refs) return

      // have to also make sure that this doesn't close when I click on ul
      for (const ref of refs) {
        if (ref.contains(event.target as Node)) {
          return
        }
      }
      callback()
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }

    // probably won't need a dep array since you check this all the time
  })
}

export default useClickAwayListener
