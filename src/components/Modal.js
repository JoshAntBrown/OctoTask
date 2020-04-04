import React from 'react'
import styled from 'styled-components'

const BackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  display: block;
  cursor: default;
  content: ' ';
  background: transparent;
  z-index: 99;
  background: rgba(27, 31, 35, 0.5);
`

const ModalDialog = styled.div.attrs({
  className:
    'Box Box--overlay d-flex flex-column anim-fade-in fast f5 overflow-auto',
  role: 'dialog',
  'aria-modal': true,
})`
  position: fixed;
  margin: 10vh auto;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  max-height: 80vh;
  max-width: 90vw;
  width: 448px;
`

const Modal = ({ onClose, children, title }) => {
  return (
    <>
      <BackgroundOverlay onClick={onClose} />
      <ModalDialog aria-label={title}>
        <div className="Box-header">
          <button
            className="Box-btn-octicon btn-octicon float-right"
            type="button"
            aria-label="Close dialog"
            data-close-dialog=""
          >
            <svg
              className="octicon octicon-x"
              viewBox="0 0 12 16"
              version="1.1"
              width="12"
              height="16"
              aria-hidden="true"
              onClick={onClose}
            >
              <path
                fillRule="evenodd"
                d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"
              ></path>
            </svg>
          </button>
          <h3 className="Box-title mb-0 mt-0">{title}</h3>
        </div>
        <div className="js-custom-thread-settings-form d-flex flex-column">
          {children}
        </div>
      </ModalDialog>
    </>
  )
}

export default Modal
