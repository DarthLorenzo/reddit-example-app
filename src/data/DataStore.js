import React, { useReducer } from 'react'

export const Actions = Object.freeze({
  TOGGLE_POST: 1,
  NEW_QUERY: 2,
  QUERYING_POSTS: 3,
  QUERYING_ABOUT: 4,
  LOAD_POSTS: 5,
  LOAD_ABOUT: 6,
  LOAD_POSTS_ERROR: 7,
  LOAD_ABOUT_ERROR: 8,
  PAGINATE: 9,
  REFOCUSED: 10,
})

export const PaginateDirections = Object.freeze({
  BACKWARDS: 'backwards',
  FORWARDS: 'forwards',
})

const initialState = {
  fetchingPosts: false,
  fetchingAbout: false,
  errorLoadingPosts: false,
  errorLoadingAbout: false,
  badQuery: false,
  subredditQuery: '',
  subredditData: null,
  postsData: [],
  afterId: null,
  beforeId: null,
  postsSeen: 0,
  paginateDirection: null,
  shouldRefocus: false,
  activePost: undefined,
  initialLoad: true,
}

//@VisibleForTesting
export const appReducer = (state, action) => {
  switch (action.type) {
    case Actions.TOGGLE_POST:
      return {
        ...state,
        activePost:
          state.activePost === action.toggledPost
            ? undefined
            : action.toggledPost,
      }
    case Actions.NEW_QUERY:
      if (state.subredditQuery !== action.newQuery) {
        return {
          ...state,
          subredditQuery: action.newQuery,
          postsSeen: 0,
        }
      } else {
        return state
      }
    case Actions.QUERYING_POSTS:
      return {
        ...state,
        fetchingPosts: true,
        errorLoadingPosts: false,
        paginateDirection: null,
      }
    case Actions.LOAD_POSTS:
      return {
        ...state,
        fetchingPosts: false,
        errorLoadingPosts: false,
        activePost: undefined,
        postsData: action.newPosts,
        afterId: action.afterId,
        beforeId: action.beforeId,
        postsSeen: action.newSeen,
        shouldRefocus: true,
      }
    case Actions.LOAD_POSTS_ERROR:
      return {
        ...state,
        fetchingPosts: false,
        errorLoadingPosts: true,
        postsData: [],
      }
    case Actions.QUERYING_ABOUT:
      return {
        ...state,
        fetchingAbout: true,
        errorLoadingAbout: false,
      }
    case Actions.LOAD_ABOUT:
      return {
        ...state,
        fetchingAbout: false,
        errorLoadingAbout: false,
        subredditData: action.subredditData,
        initialLoad: false,
      }
    case Actions.LOAD_ABOUT_ERROR:
      return {
        ...state,
        fetchingAbout: false,
        errorLoadingAbout: true,
        subredditData: null,
      }
    case Actions.PAGINATE:
      return {
        ...state,
        paginateDirection: action.paginateDirection,
      }
    case Actions.REFOCUSED:
      return {
        ...state,
        shouldRefocus: false,
      }
    default:
      return state
  }
}

export const AppStateContext = React.createContext(initialState)
export const AppDispatchContext = React.createContext()

export const useAppReducer = () => {
  return useReducer(appReducer, initialState)
}
