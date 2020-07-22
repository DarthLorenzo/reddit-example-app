import React from 'react'
import classNames from 'classnames'

import {
  AppDispatchContext,
  AppStateContext,
  useAppReducer,
} from './data/DataStore'
import useRedditData from './data/Reddit'
import { hexToRGB } from './data/Util'

import NavBar from './components/NavBar'
import Main from './components/Main'

import './App.scss'

const App = () => {
  const [state, dispatch] = useAppReducer()
  useRedditData(state, dispatch)

  const { subredditData, fetchingAbout } = state
  const subredditColor = subredditData?.primaryColor ?? '#000000'

  return (
    <AppDispatchContext.Provider value={dispatch}>
      <AppStateContext.Provider value={state}>
        <div
          className={classNames('app', { loading: fetchingAbout })}
          style={{ '--subreddit-rgb': hexToRGB(subredditColor) }}
        >
          <NavBar />
          <Main />
        </div>
      </AppStateContext.Provider>
    </AppDispatchContext.Provider>
  )
}

export default App
