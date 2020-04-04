import { useEffect, useState } from 'react'

export const useTrackElementById = id => {
  const [element, setElement] = useState(document.getElementById(id))

  useEffect(() => {
    if (element !== document.getElementById(id)) {
      setElement(document.getElementById(id))
    }

    const observer = new MutationObserver(mutationsList => {
      // eslint-disable-next-line no-restricted-syntax
      for (const mutation of mutationsList) {
        // Look for nodes getting deleted
        if (mutation.type === 'childList' && mutation.removedNodes) {
          // eslint-disable-next-line no-restricted-syntax
          for (const removedNode of mutation.removedNodes) {
            if (removedNode.contains(element)) {
              // Find the new element and set the state.
              const target = mutation.target.querySelector(`#${id}`)
              if (target) {
                setElement(target)
              } else {
                setElement(null)
              }
            }
          }
        }

        if (!element && mutation.type === 'childList' && mutation.addedNodes) {
          const target = mutation.target.querySelector(`#${id}`)
          if (target) {
            setElement(target)
          }
        }
      }
    })

    observer.observe(document.body, {
      attributes: false,
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [id, element])

  return element
}
