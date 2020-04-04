import { useRef } from 'react'

export const usePortalGenerator = () => {
  const portalRefs = useRef({})

  const getPortal = id => {
    if (portalRefs.current[id]) return portalRefs.current[id]

    const portalElement = document.createElement('div')
    portalRefs.current[id] = portalElement

    return portalElement
  }

  const getPortalElement = (id, targetParent) => {
    const portalElement = getPortal(id)

    // Add portal to parent if one is defined and it doesn't exist within it
    if (targetParent && !targetParent.contains(portalElement)) {
      targetParent.appendChild(portalElement)
    }

    return portalElement
  }

  return { portalRefs, getPortalElement }
}
