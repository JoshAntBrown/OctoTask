import { useEffect, useState } from 'react'

export const useTrackElementById = id => {
  const [element, setElement] = useState(document.getElementById(id))

  useEffect(() => {
    if (element !== document.getElementById(id)) {
      setElement(document.getElementById(id))
    }

    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        // Look for nodes getting deleted
        if (mutation.type === 'childList' && mutation.removedNodes) {
          for (let removedNode of mutation.removedNodes) {
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

// useEffect(() => {
//   // We'll keep track of whether our React Portal gets removed from the DOM
//   // If it gets removed then we'll look for a new place to insert it.
//   const observer = new MutationObserver((mutationsList, observer) => {
//     for (let mutation of mutationsList) {
//       // Look for nodes getting deleted
//       if (mutation.type === 'childList' && mutation.removedNodes) {
//         for (let removedNode of mutation.removedNodes) {
//           for (let { key, taskList, portalRoot } of taskLists) {
//             if (removedNode.contains(settingsRoot)) {
//               const _sidebar = mutation.target.getElementById(
//                 'partial-discussion-sidebar',
//               )
//               if (_sidebar) {
//                 _sidebar.appendChild(settingsRoot)
//               }
//             }
//
//             // Does that node include one of our portals?
//             if (removedNode.contains(portalRoot)) {
//               // TODO: Sync the taskList up the state again...
//               // setTaskList({})
//               // Need a better way to identify unique task lists,
//               // What happens if a task list gets removed?
//               // The key wouldn't match anymore.
//
//               // Insert the portal back into the DOM.
//               mutation.target.querySelector(key).appendChild(portalRoot)
//             }
//           }
//         }
//       }
//     }
//   })
//   observer.observe(document.getElementsByClassName('repository-content')[0], {
//     attributes: false,
//     childList: true,
//     subtree: true,
//   })
//
//   return () => {
//     observer.disconnect()
//   }
// }, [taskLists])
