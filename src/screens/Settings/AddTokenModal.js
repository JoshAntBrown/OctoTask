import React, { useState } from 'react'
import Modal from '../../components/Modal'

export const AddTokenModal = ({ initialValue, onSave, onClose = () => {} }) => {
  const [value, setValue] = useState(initialValue)

  return (
    <Modal title={`Project Tools Settings`} onClose={onClose}>
      <div className="d-flex flex-column p-3">
        <p>
          Using this extension requires a GitHub access token.
          <br /> Please enter a token.
        </p>
        <input
          className="form-control js-quick-submit flex-auto input-lg input-contrast mr-0"
          placeholder="GitHub token"
          type="password"
          value={value}
          onChange={event => {
            setValue(event.target.value)
          }}
        />
      </div>
      <div className="Box-footer form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          data-disable-with="Saving…"
          autoFocus
          onClick={() => {
            if (!value) {
              alert('You must have entered a token to continue.')
              return
            }

            onSave(value)
            onClose()
          }}
        >
          Save
        </button>
        <button
          type="reset"
          className="btn"
          data-close-dialog=""
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}
