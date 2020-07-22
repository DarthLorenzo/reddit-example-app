import React, { useContext } from 'react'
import classNames from 'classnames'

import { AppStateContext } from '../data/DataStore'
import { parseMarkupText, isNonEmptyString } from '../data/Util'

const SideBar = () => {
  const {
    subredditData,
    fetchingAbout,
    errorLoadingAbout,
    initialLoad,
  } = useContext(AppStateContext)

  const { summary, name } = subredditData ?? {}

  const topbarContents = `About ${name}`

  if (initialLoad || errorLoadingAbout) {
    return <></>
  } else {
    return (
      <aside
        className={classNames('sidebar', 'container', {
          loading: fetchingAbout,
        })}
      >
        <h2 className="topBar text">{topbarContents}</h2>
        <p className="content text">
          {isNonEmptyString(summary)
            ? parseMarkupText(summary)
            : `Welcome to ${name}`}
        </p>
      </aside>
    )
  }
}

export default SideBar
