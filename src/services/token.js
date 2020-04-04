import React, { createContext, useContext, useEffect } from 'react'
import { ClientContext } from 'graphql-hooks'
import useChromeStorageLocal from '../hooks/useChromeStorageLocal'
import { AddTokenModal } from '../screens/Settings/AddTokenModal'

const TokenContext = createContext()

export const GitHubTokenProvider = ({ children }) => {
  const client = useContext(ClientContext)
  const [loadingToken, token, setToken] = useChromeStorageLocal('token')

  useEffect(() => {
    if (token) client.setHeader('Authorization', `Bearer ${token}`)
  }, [token])

  if (loadingToken) return null

  if (!token)
    return (
      <AddTokenModal
        initialValue={token}
        onSave={value => {
          setToken(value)
        }}
      />
    )

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}

export const useGitHubToken = () => {
  const token = useContext(TokenContext)
  return token
}
