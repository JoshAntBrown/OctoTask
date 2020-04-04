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
              setElement(mutation.target.querySelector(`#${id}`))
            }
          }
        }
      }
    })

    observer.observe(document.getElementsByClassName('repository-content')[0], {
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
