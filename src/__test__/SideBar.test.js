import React from 'react'
import { render, screen } from '@testing-library/react'

import { AppStateContext } from '../data/DataStore'
import { expectToRenderNothing } from './TestUtils'

import SideBar from '../components/SideBar'

describe('<SideBar> unit tests', () => {
  const exampleSubreditData = {
    name: 'r/testdata',
    summary:
      'This is the test summary content for this fake subreddit. It is often a few sentences long.',
  }

  const basicState = {
    subredditData: exampleSubreditData,
    fetchingAbout: false,
    errorLoadingAbout: false,
    initialLoad: false,
  }

  test('should display content in happy path state', () => {
    const happyPathState = { ...basicState }

    render(
      <AppStateContext.Provider value={happyPathState}>
        <SideBar />
      </AppStateContext.Provider>
    )

    expect(
      screen.queryByText(exampleSubreditData.name, {
        exact: false,
      })
    ).not.toBeNull()
    expect(
      screen.queryByText(exampleSubreditData.summary, {
        exact: false,
      })
    ).not.toBeNull()
  })

  test('should display placeholder content when summary missing from subreddit state', () => {
    const noSummarySubredditData = { ...exampleSubreditData, summary: null }
    const noSummaryState = {
      ...basicState,
      subredditData: noSummarySubredditData,
    }

    render(
      <AppStateContext.Provider value={noSummaryState}>
        <SideBar />
      </AppStateContext.Provider>
    )

    expect(
      screen.queryAllByText(exampleSubreditData.name, {
        exact: false,
      })
    ).not.toBeNull()
    expect(
      screen.queryByText('Welcome to', {
        exact: false,
      })
    ).not.toBeNull()
  })

  test('should display nothing before first subreddit query', () => {
    const startingState = { ...basicState, initialLoad: true }

    expectToRenderNothing(
      <AppStateContext.Provider value={startingState}>
        <SideBar />
      </AppStateContext.Provider>
    )
  })

  test('should display nothing when in there is an error loading subreadit info', () => {
    const startingState = { ...basicState, errorLoadingAbout: true }

    expectToRenderNothing(
      <AppStateContext.Provider value={startingState}>
        <SideBar />
      </AppStateContext.Provider>
    )
  })
})
