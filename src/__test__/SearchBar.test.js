import React from 'react'
import { render, act, screen } from '@testing-library/react'
import user from '@testing-library/user-event'

import { AppStateContext, AppDispatchContext } from '../data/DataStore'

import SearchBar from '../components/SearchBar'

describe('<SearchBar> unit tests', () => {
  const testState = {
    subredditQuery: 'wordpress',
    errorLoadingAbout: false,
  }

  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  test('should display without error in happy path state', () => {
    const happyPathState = { ...testState }

    render(
      <AppStateContext.Provider value={happyPathState}>
        <SearchBar />
      </AppStateContext.Provider>
    )

    expect(screen.getByLabelText('Explore subreddits')).toBeValid()
  })

  test('should display error when providing malformed search text', async () => {
    const happyPathState = { ...testState }

    render(
      <AppStateContext.Provider value={happyPathState}>
        <AppDispatchContext.Provider value={jest.fn()}>
          <SearchBar />
        </AppDispatchContext.Provider>
      </AppStateContext.Provider>
    )

    const searchInput = screen.getByLabelText('Explore subreddits')
    expect(searchInput).toBeInTheDocument()
    await user.type(searchInput, 'aa;') // only word characters allowed
    act(() => jest.advanceTimersByTime(1200))
    expect(searchInput).toBeInvalid()
  })
})
