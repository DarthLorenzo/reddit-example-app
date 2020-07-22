import { useEffect } from 'react'
import axios from 'axios'

import { Actions, PaginateDirections } from '../data/DataStore'
import { isNonEmptyString } from '../data/Util'

const extractPostInfo = (post) => {
  const {
    id,
    title,
    author,
    created_utc,
    selftext,
    ups,
    downs,
    num_comments,
    url,
    is_reddit_media_domain,
    is_video,
    crosspost_parent,
  } = post.data
  return {
    id,
    title,
    author,
    created: created_utc,
    postText: selftext,
    votes: ups - downs,
    numComments: num_comments,
    url,
    isImage: is_reddit_media_domain && !is_video && !crosspost_parent,
  }
}

const extractPosts = (results) => {
  const rawPosts = results.data.data.children
  return [
    rawPosts.map(extractPostInfo),
    results.data.data.after,
    results.data.data.before,
  ]
}

const extractAbout = (results) => {
  const rawAbout = results.data.data
  const {
    title,
    display_name_prefixed,
    community_icon,
    banner_background_image,
    public_description,
    description,
    created,
    subscribers,
    accounts_active,
    primary_color,
  } = rawAbout
  return {
    title,
    name: display_name_prefixed,
    icon: community_icon,
    banner: banner_background_image,
    summary: public_description,
    description,
    created,
    totalUsers: subscribers,
    activeUsers: accounts_active,
    primaryColor: primary_color,
  }
}

const fetchAbout = async (dispatch, subreddit) => {
  dispatch({ type: Actions.QUERYING_ABOUT })
  try {
    const results = await axios(
      `https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`
    )
    const subredditData = extractAbout(results)
    dispatch({ type: Actions.LOAD_ABOUT, subredditData })
  } catch (error) {
    console.log('LOAD_ABOUT_ERROR', error)
    dispatch({ type: Actions.LOAD_ABOUT_ERROR })
  }
}

const fetchPosts = async (dispatch, subreddit, seen, beforeId, afterId) => {
  dispatch({ type: Actions.QUERYING_POSTS })
  try {
    const tempSeen = afterId ? seen + 10 : seen
    const query = `https://www.reddit.com/r/${subreddit}/new.json?raw_json=1&limit=10&count=${tempSeen}&before=${beforeId}&after=${afterId}`
    const results = await axios(query)
    const [newPosts, newAfterId, newBeforeId] = extractPosts(results)
    dispatch({
      type: Actions.LOAD_POSTS,
      newPosts,
      afterId: newAfterId,
      beforeId: newBeforeId,
      newSeen: beforeId ? seen - 10 : tempSeen,
    })
  } catch (error) {
    console.log('LOAD_POSTS_ERROR', error)
    dispatch({ type: Actions.LOAD_POSTS_ERROR })
  }
}

const useRedditData = (state, dispatch) => {
  const {
    subredditQuery,
    afterId,
    beforeId,
    postsSeen,
    paginateDirection,
  } = state

  useEffect(() => {
    if (!isNonEmptyString(subredditQuery)) {
      return
    }
    fetchAbout(dispatch, subredditQuery)
    fetchPosts(dispatch, subredditQuery, 0, null, null)
  }, [subredditQuery, /* should be constant */ dispatch])

  useEffect(() => {
    if (!isNonEmptyString(paginateDirection)) {
      return
    } else if (!isNonEmptyString(subredditQuery)) {
      console.log('no valid subredditQuery when paginating')
      dispatch({ type: Actions.LOAD_POSTS_ERROR })
      return
    } else if (
      paginateDirection === PaginateDirections.BACKWARDS &&
      !isNonEmptyString(beforeId)
    ) {
      console.log('no valid beforeId when paginating backward')
      dispatch({ type: Actions.LOAD_POSTS_ERROR })
      return
    } else if (
      paginateDirection === PaginateDirections.FORWARDS &&
      !isNonEmptyString(afterId)
    ) {
      console.log('no valid afterId when paginating forwards')
      dispatch({ type: Actions.LOAD_POSTS_ERROR })
      return
    }

    if (paginateDirection === PaginateDirections.BACKWARDS) {
      fetchPosts(dispatch, subredditQuery, postsSeen, beforeId, null)
    } else if (paginateDirection === PaginateDirections.FORWARDS) {
      fetchPosts(dispatch, subredditQuery, postsSeen, null, afterId)
    } else {
      console.log('no valid paginateDirection when paginating')
      dispatch({ type: Actions.LOAD_POSTS_ERROR })
      return
    }
  }, [
    paginateDirection,
    /* the follow may change independently of pagination*/ subredditQuery,
    afterId,
    beforeId,
    postsSeen,
    /* should be constant */ dispatch,
  ])
}

export default useRedditData
