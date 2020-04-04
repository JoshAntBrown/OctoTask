import React from 'react'
import ReactDOM from 'react-dom'
import { useTrackElementById } from '../../hooks/useTrackElementById'
import { usePortalGenerator } from '../../hooks/usePortalGenerator'
import { SettingsPortal } from './SettingsPortal'

export const Settings = () => {
  const { getPortalElement } = usePortalGenerator()
  const sidebarElement = useTrackElementById('partial-discussion-sidebar')

  // Can't render the portal if there's no target to render to.
  if (!sidebarElement) return null

  const portalElement = getPortalElement('settings-option', sidebarElement)

  return ReactDOM.createPortal(<SettingsPortal />, portalElement)
}
