import { Actions, appReducer } from '../data/DataStore'

describe('appReducer() unit test', () => {
  test('TOGGLE_POST should unset active post when active post toggled ', () => {
    const initialState = { activePost: 'test12' }
    const action = { type: Actions.TOGGLE_POST, toggledPost: 'test99' }
    const secondState = appReducer(initialState, action)
    expect(secondState.activePost).toBe('test99')
    const thirdState = appReducer(secondState, action)
    expect(thirdState.activePost).toBeUndefined()
  })

  test('NEW_QUERY should only change on actual new query ', () => {
    const initialState = { subredditQuery: 'subredditA' }
    const action = { type: Actions.NEW_QUERY, newQuery: 'subredditB' }
    const secondState = appReducer(initialState, action)
    expect(secondState.subredditQuery).toEqual('subredditB')
    const thirdState = appReducer(secondState, action)
    expect(thirdState).toBe(secondState)
  })
})
