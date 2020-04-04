/* global chrome */

import { useState, useEffect } from 'react'

const useChromeStorageLocal = target => {
  const [initialising, setInitialising] = useState(true)
  const [value, setValue] = useState()

  useEffect(() => {
    chrome.storage.local.get(target, store => {
      setValue(store[target])
      setInitialising(false)
    })

    const onStorageChange = changes => {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in changes) {
        if (key === target) {
          setValue(changes[key].newValue)
        }
      }
    }

    chrome.storage.onChanged.addListener(onStorageChange)

    return () => {
      chrome.storage.onChanged.removeListener(onStorageChange)
    }
  }, [target])

  return [
    initialising,
    value,
    val => {
      chrome.storage.local.set({ [target]: val })
    },
  ]
}

export default useChromeStorageLocal
