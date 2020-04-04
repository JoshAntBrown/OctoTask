import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import unique from 'unique-selector'
import { GraphQLClient, ClientContext } from 'graphql-hooks'
import { GitHubTokenProvider } from './services/token'
import { Settings } from './screens/Settings'
import { Issue } from './screens/Issue'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const client = new GraphQLClient({
  url: 'https://api.github.com/graphql',
})

const App = () => {
  return (
    <ClientContext.Provider value={client}>
      <GitHubTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/:orgName/:repoName/issues/:issueNumber"
              element={<Issue />}
            />
          </Routes>
        </BrowserRouter>
        <Settings />
      </GitHubTokenProvider>
    </ClientContext.Provider>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)

ReactDOM.render(<App />, root)
