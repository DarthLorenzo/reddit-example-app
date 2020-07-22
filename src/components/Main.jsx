import React, { useContext, useEffect, useRef } from 'react'

import { Actions, AppDispatchContext, AppStateContext } from '../data/DataStore'

import Banner from './Banner'
import Posts from './Posts'
import SideBar from './SideBar'

const Main = () => {
  const { shouldRefocus, initialLoad } = useContext(AppStateContext)
  const dispatch = useContext(AppDispatchContext)
  const scollableRef = useRef(null)

  useEffect(() => {
    if (shouldRefocus) {
      scollableRef.current.scrollTo(0, 0)
      dispatch({ type: Actions.REFOCUSED })
    }
  }, [shouldRefocus, /* should be constant */ dispatch])

  if (initialLoad) {
    return (
      <main className="initial">
        <Banner />
        <article>
          <h1>
            Welcome! Search for communities above. Maybe try{' '}
            <button
              className="initial"
              onClick={() =>
                dispatch({ type: Actions.NEW_QUERY, newQuery: 'wordpress' })
              }
            >
              r/wordpress
            </button>
            ?
          </h1>
        </article>
      </main>
    )
  }
  return (
    <main ref={scollableRef}>
      <Banner />
      <article>
        <Posts />
        <SideBar />
      </article>
    </main>
  )
}

export default Main
