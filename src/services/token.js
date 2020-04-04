import React, { createContext, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ClientContext } from 'graphql-hooks'
import useChromeStorageLocal from '../hooks/useChromeStorageLocal'

const TokenContext = createContext()

export const GitHubTokenProvider = ({ children }) => {
  const client = useContext(ClientContext)
  const [loadingToken, token] = useChromeStorageLocal('token')

  useEffect(() => {
    if (token) client.setHeader('Authorization', `Bearer ${token}`)
  }, [token])

  if (loadingToken) return null

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}

GitHubTokenProvider.propTypes = {
  children: PropTypes.node,
}

GitHubTokenProvider.defaultProps = {
  children: null,
}

export const useGitHubToken = () => {
  const token = useContext(TokenContext)
  return token
}
