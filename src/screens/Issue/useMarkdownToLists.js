import marked from 'marked'
import { useMemo } from 'react'

export const useMarkdownToLists = data => {
  return useMemo(() => {
    if (!data) return null

    const tokens = marked.lexer(data.resource.body)

    const result = tokens.reduce(
      (state, token, idx) => {
        // Ignore everything when we're not starting a list or adding to one
        if (token.type !== 'list_start' && state.inList === null) return state

        // Record that we're starting a new list and set it up
        if (token.type === 'list_start') {
          const listIdx = Object.values(state.lists).length
          return {
            ...state,
            lists: {
              ...state.lists,
              [listIdx]: {
                id: `list-${listIdx}`,
                idx: listIdx,
                items: {},
              },
            },
            inList: listIdx,
          }
        }

        // Record that we're no longer adding to a list
        if (token.type === 'list_end') {
          return {
            ...state,
            inList: null,
          }
        }

        // Ignore anything at this point that isn't starting a new list item,
        // or adding to a current one
        if (token.type !== 'list_item_start' && data.inListItem === null) {
          return state
        }

        // Save the current list that we're dealing with to make things easier
        const currentList = state.lists[state.inList]

        // Record that we're now adding to a new list item and set it up
        if (token.type === 'list_item_start') {
          const listItemIdx = Object.values(currentList.items).length

          return {
            ...state,
            lists: {
              ...state.lists,
              [state.inList]: {
                ...currentList,
                items: {
                  ...currentList.items,
                  [listItemIdx]: {
                    id: `list-${state.inList}-item-${listItemIdx}`,
                    task: token.task,
                    checked: token.checked,
                    loose: token.loose,
                    innerTokens: [],
                  },
                },
              },
            },
            inListItem: listItemIdx,
          }
        }

        // Record that we're no longer adding to a list item in a list
        if (token.type === 'list_item_end') {
          return {
            ...state,
            inListItem: null,
          }
        }

        // Add everything that makes it this far into the list item of the list
        return {
          ...state,
          lists: {
            ...state.lists,
            [state.inList]: {
              ...currentList,
              items: {
                ...currentList.items,
                [state.inListItem]: {
                  ...currentList.items[state.inListItem],
                  innerTokens: [
                    ...currentList.items[state.inListItem].innerTokens,
                    token,
                  ],
                },
              },
            },
          },
        }
      },
      {
        lists: [],
        inList: null,
        inListItem: null,
      },
    )

    return Object.values(result.lists).map(list => ({
      ...list,
      items: Object.values(list.items),
    }))
  }, [data])
}
