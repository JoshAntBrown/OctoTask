export const addToList = (issueBody, task) => {
  const lines = issueBody.split('\r\n')

  // Where does the target list end?
  const result = lines.reduce(
    (state, line, idx) => {
      const listItemRegex = /^- *?\[[ x]\]/gm
      const currentLineIsListItem = !!line.match(listItemRegex)

      if (state.inList === null) {
        if (currentLineIsListItem) {
          const nextListIdx = Object.values(state.lists).length
          // console.log({
          //   message: `Starting new list ${nextListIdx}`,
          //   line,
          // })
          return {
            ...state,
            inList: nextListIdx,
            prevLine: line,
            lists: {
              ...state.lists,
              [nextListIdx]: {
                startIdx: idx,
                endIdx: idx,
              },
            },
          }
        }

        // console.log({
        //   message: `Ignoring line`,
        //   line,
        // })
        return state
      }

      // TODO: Add additional cases that cause a list to end:
      // - [ ] Regular text where the previous line was empty
      const rootHeadingRegex = /^ ?#/gim
      const currentLineIsRootHeading = !!line.match(rootHeadingRegex)
      if (currentLineIsRootHeading) {
        // console.log({
        //   message: `Ending list ${state.inList}`,
        //   line,
        // })
        return {
          ...state,
          prevLine: line,
          inList: null,
        }
      }

      // console.log({
      //   message: `Updating current list ${state.inList} with endIdx: ${idx}`,
      //   line,
      // })
      return {
        ...state,
        prevLine: line,
        lists: {
          ...state.lists,
          [state.inList]: {
            ...state.lists[state.inList],
            endIdx: line.trim() !== '' ? idx : state.lists[state.inList].endIdx,
          },
        },
      }
    },
    {
      lists: {},
      inList: null,
    },
  )

  // Get information about the target list
  const targetList = result.lists[task.list]

  // Generate a new set of lines by inserting the task into the right place
  const newLines = [
    ...lines.slice(0, targetList.endIdx + 1),
    `- [ ] ${task.title}`,
    ...lines.slice(targetList.endIdx + 1),
  ]

  // Re-assemble the body with the new lines
  return newLines.join('\r\n')
}
