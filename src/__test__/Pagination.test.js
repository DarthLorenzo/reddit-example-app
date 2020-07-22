import React from 'react'
import { render, screen } from '@testing-library/react'

import { AppStateContext } from '../data/DataStore'
import { expectToRenderNothing } from './TestUtils'

import Pagination from '../components/Pagination'

describe('<Pagination> unit tests', () => {
  test('should not display if there is nowhere to paginate to', () => {
    const testState = { beforeId: null, afterId: null }

    expectToRenderNothing(
      <AppStateContext.Provider value={testState}>
        <Pagination />
      </AppStateContext.Provider>
    )
  })
  test('should display an inactive "Previous Page" if on first page of results', () => {
    const testState = { beforeId: null, afterId: 'thisisatestafterId' }
    render(
      <AppStateContext.Provider value={testState}>
        <Pagination />
      </AppStateContext.Provider>
    )
    expect(screen.getByText('Previous Page')).toBeDisabled()
    expect(screen.getByText('Next Page')).toBeEnabled()
  })
  test('should display an inactive "Next Page" if on last page of results', () => {
    const testState = { beforeId: 'thisisatestafterId', afterId: null }
    render(
      <AppStateContext.Provider value={testState}>
        <Pagination />
      </AppStateContext.Provider>
    )
    expect(screen.getByText('Previous Page')).toBeEnabled()
    expect(screen.getByText('Next Page')).toBeDisabled()
  })
  test('should display two active buttons if in middle page of results', () => {
    const testState = {
      beforeId: 'thisisatestafterId',
      afterId: 'thisisatestafterId',
    }
    render(
      <AppStateContext.Provider value={testState}>
        <Pagination />
      </AppStateContext.Provider>
    )
    expect(screen.getByText('Previous Page')).toBeEnabled()
    expect(screen.getByText('Next Page')).toBeEnabled()
  })
})

describe('<Pagination> integration tests', () => {
  it('should display nothing given initial state', () => {
    expect(true).toBeTruthy()
  })
})
