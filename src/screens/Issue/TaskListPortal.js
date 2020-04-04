import React, { useState, useReducer } from 'react'
import styled from 'styled-components'
import { useQuery, useManualQuery, useMutation } from 'graphql-hooks'
import useChromeStorageLocal from '../../hooks/useChromeStorageLocal'
import { addToList } from './addToList'

const Form = styled.form`
  margin-top: 6px;
  background-color: #f1f8ff;
  border: 1px solid #c0d3eb;
  padding: 12px;
  border-radius: 4px;
`

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

const initialState = {
  title: '',
  repoNameWithOwner: '',
}
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      }

    case 'RESET_FORM':
      return {
        ...initialState,
      }

    default:
      throw new Error('Type not recognised')
  }
}

const CREATE_ISSUE = `
  mutation CreateIssue($issue: CreateIssueInput!) {
    createIssue(input: $issue) {
      clientMutationId
      issue {
        number
      }
    }
  }
`

const UPDATE_ISSUE = `
  mutation UpdateIssue($issue: UpdateIssueInput!) {
    updateIssue(input: $issue) {
      clientMutationId
    }
  }
`

const GET_REPOSITORY = `
  query GetRepository($name: String!, $owner: String!){
    repository(name: $name, owner: $owner){
      id
    }
  }
`

const GET_RESOURCE = `
  query GetResource($url: URI!) {
    resource(url: $url) {
      resourcePath
      ... on Issue {
        id
        number
        body
        repository {
          id
          nameWithOwner
        }
      }
    }
  }
`

export const TaskListPortal = ({ listIdx }) => {
  const [state, dispatch] = useReducer(formReducer, initialState)
  const [addingTask, setAddingTask] = useState(false)
  const [createIssue] = useMutation(CREATE_ISSUE)
  const [updateIssue] = useMutation(UPDATE_ISSUE)
  const [getRepository] = useManualQuery(GET_REPOSITORY)
  const [getResource] = useManualQuery(GET_RESOURCE, {
    variables: {
      url: window.location.href,
    },
  })
  const { loading, error, data } = useQuery(GET_RESOURCE, {
    variables: {
      url: window.location.href,
    },
  })

  const onClose = () => setAddingTask(false)

  const setValue = (key, value) => {
    dispatch({
      type: 'SET_VALUE',
      payload: {
        key,
        value,
      },
    })
  }

  const cleanupForm = () => {
    dispatch({ type: 'RESET_FORM' })
    setAddingTask(false)
  }

  if (loading) return null

  return (
    <>
      {addingTask ? (
        <Form
          className="d-flex flex-column"
          onSubmit={async event => {
            event.preventDefault()

            const [repoOwner, repoName] = (
              state.repoNameWithOwner || data.resource.repository.nameWithOwner
            ).split('/')

            if (state.title.trim() !== '') {
              const {
                data: { repository },
              } = await getRepository({
                variables: {
                  name: repoName,
                  owner: repoOwner,
                },
              })
              const result = await createIssue({
                variables: {
                  issue: {
                    repositoryId: repository.id,
                    title: state.title,
                    body: `Relates to ${data.resource.repository.nameWithOwner}#${data.resource.number}`,
                  },
                },
              })

              const { data: updatedData } = await getResource()

              const newBody = addToList(updatedData.resource.body, {
                list: listIdx,
                title: `${state.title} ${repoOwner}/${repoName}#${result.data.createIssue.issue.number}`,
              })

              updateIssue({
                variables: {
                  issue: {
                    id: updatedData.resource.id,
                    body: newBody,
                  },
                },
              })
            }

            cleanupForm()
          }}
        >
          <input
            type="text"
            className="form-control js-quick-submit flex-auto input-m input-contrast mr-0"
            placeholder="Describe this task"
            value={state.title}
            onChange={event => setValue('title', event.target.value)}
            autoFocus
          />
          <input
            type="text"
            className="form-control js-quick-submit flex-auto input-m input-contrast mr-0"
            placeholder="Repository (blank defaults to current organisation)"
            value={state.repoNameWithOwner}
            onChange={event =>
              setValue('repoNameWithOwner', event.target.value)
            }
          />
          <div className="d-block mt-md-2">
            <button
              type="submit"
              className="btn btn-primary btn-sm mr-2 mr-md-0"
            >
              Add this task
            </button>
            <button
              type="button"
              className="btn btn-sm m-0 ml-0 ml-md-2"
              onClick={() => {
                setAddingTask(false)
              }}
            >
              Cancel
            </button>
          </div>
        </Form>
      ) : (
        <button
          className="btn btn-sm mt-md-1"
          onClick={() => {
            setAddingTask(true)
          }}
        >
          Add a task
        </button>
      )}
    </>
  )
}
