import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { useLocation } from 'react-router-dom'
import { useQuery } from 'graphql-hooks'
import { useTrackElementById } from '../../hooks/useTrackElementById'
import { usePortalGenerator } from '../../hooks/usePortalGenerator'
import { TaskListPortal } from './TaskListPortal'
import { useMarkdownToLists } from './useMarkdownToLists'

const GET_RESOURCE = `
  query GetResource($url: URI!) {
    resource(url: $url) {
      resourcePath
      ... on Issue {
        id
        number
        databaseId
        body
        repository {
          id
        }
      }
    }
  }
`

export const Issue = () => {
  const { getPortalElement } = usePortalGenerator()
  const { pathname } = useLocation()
  const { data, refetch } = useQuery(GET_RESOURCE, {
    variables: {
      url: pathname,
    },
  })
  const issueElement = useTrackElementById(
    data ? `issue-${data.resource.databaseId}` : null,
  )

  // Not using this yet, but could come in handy?
  // const lists = useMarkdownToLists(data)

  if (!data || !issueElement) return null

  const commentBodyElement = issueElement.querySelector('.js-comment-body')
  const listElements = Array.from(commentBodyElement.querySelectorAll('ul'))

  return (
    <>
      {listElements.map((listElement, idx) => {
        const portalElement = getPortalElement(`list-${idx}`, listElement)

        return (
          <div key={`list-${idx}`}>
            {ReactDOM.createPortal(
              <TaskListPortal listIdx={idx} />,
              portalElement,
            )}
          </div>
        )
      })}
    </>
  )
}
