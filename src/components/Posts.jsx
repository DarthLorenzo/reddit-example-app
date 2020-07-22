import React, { useContext, useRef } from 'react'

import { AppStateContext } from '../data/DataStore'

import Pagination from './Pagination'
import Post from './Post'

const Posts = () => {
  const {
    subredditData,
    postsData,
    activePost,
    fetchingPosts,
    errorLoadingPosts,
  } = useContext(AppStateContext)
  const containerRef = useRef(null)

  if (errorLoadingPosts) {
    return (
      <div className="posts error" aria-live="polite">
        <h2>Whoops! Nothing here</h2>
        <p>Loading error content. Try searching for something else.</p>
      </div>
    )
  }

  const headingContent = `Newest ${subredditData?.name} Posts`
  return (
    <div className="posts" aria-labelledby="postsLabel" ref={containerRef}>
      <h2 className="sr-only" aria-live="polite" id="postsLabel">
        {headingContent}
      </h2>
      {postsData.map((post) => (
        <Post
          key={post.id}
          post={post}
          active={post.id === activePost}
          loading={fetchingPosts}
        />
      ))}
      <Pagination />
    </div>
  )
}

export default Posts
