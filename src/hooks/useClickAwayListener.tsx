import React, { useRef, useEffect } from "react"

/**
 * Hook that alerts clicks outside of the passed ref
 */

// gotta switch this to Element[] or something
const useClickAwayListener = (refs: Element[] | null, callback: () => void) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: MouseEvent) => {
      // have to also make sure that this doesn't close when I click on ul
      // ie. need an array of Elements or something
      if (!refs) return
      // if (refs.length && !refs.includes(event.target as Node)) {
      //           // alert("You clicked outside of me!")
      //           callback()
      //         }
      // for (const ref of refs) {
      //   if (ref && !ref.contains(event.target as Node)) {
      //     // alert("You clicked outside of me!")
      //     callback()
      //   }
      // }
      for (const ref of refs) {
        if (ref.contains(event.target as Node)) {
          // alert("You clicked outside of me!")
          return
        }
      }
      callback()
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
    // dunno if we need a dep array since we have to check on every click if it's the element
  })
}

export default useClickAwayListener
