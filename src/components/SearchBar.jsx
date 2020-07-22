import React, { useState, useEffect, useContext } from 'react'
import classNames from 'classnames'

import { AppDispatchContext, AppStateContext, Actions } from '../data/DataStore'
import useDebounce from '../data/Debounce'

const inputValidationPattern = new RegExp(/^[\w]+$/)

const SearchBar = () => {
  const dispatch = useContext(AppDispatchContext)
  const { errorLoadingAbout, subredditQuery } = useContext(AppStateContext)

  const [search, setSearch] = useState('')
  const [isError, setIsError] = useState(errorLoadingAbout)
  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    if (errorLoadingAbout) {
      setIsError(true)
    }
  }, [errorLoadingAbout])

  useEffect(() => {
    if (search === '') {
      setIsError(false)
    }
  }, [search])

  useEffect(() => {
    if (inputValidationPattern.test(debouncedSearch)) {
      setIsError(false)
      dispatch({ type: Actions.NEW_QUERY, newQuery: debouncedSearch })
    } else if (debouncedSearch !== '') {
      setIsError(true)
    }
  }, [debouncedSearch, /* should be constant */ dispatch])

  useEffect(() => {
    setSearch(subredditQuery)
  }, [subredditQuery])

  return (
    <nav className="searchbar">
      <label className="sr-only" htmlFor="subredditQuery">
        Explore subreddits
      </label>
      <input
        type="search"
        name="subreddit query"
        id="subredditQuery"
        placeholder="Explore subreddits"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        pattern="[\w]+"
        aria-invalid={isError}
        className={classNames({ invalid: isError })}
        autoFocus
      />
    </nav>
  )
}

export default SearchBar
