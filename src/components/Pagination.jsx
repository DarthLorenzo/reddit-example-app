import React, { useContext } from 'react'

import {
  Actions,
  AppDispatchContext,
  AppStateContext,
  PaginateDirections,
} from '../data/DataStore'
import { isNonEmptyString } from '../data/Util'

const Pagination = () => {
  const { beforeId, afterId } = useContext(AppStateContext)
  const dispatch = useContext(AppDispatchContext)

  const gotoPrevPage = () => {
    dispatch({
      type: Actions.PAGINATE,
      paginateDirection: PaginateDirections.BACKWARDS,
    })
  }
  const gotoNextPage = () => {
    dispatch({
      type: Actions.PAGINATE,
      paginateDirection: PaginateDirections.FORWARDS,
    })
  }

  const isNavigation = isNonEmptyString(beforeId) || isNonEmptyString(afterId)

  if (isNavigation) {
    return (
      <nav>
        <button
          key="back"
          disabled={!isNonEmptyString(beforeId)}
          onClick={gotoPrevPage}
        >
          Previous Page
        </button>
        <button
          key="forward"
          disabled={!isNonEmptyString(afterId)}
          onClick={gotoNextPage}
        >
          Next Page
        </button>
      </nav>
    )
  } else {
    return <></>
  }
}

export default Pagination
