import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { AppDispatchContext, Actions } from '../data/DataStore'
import {
  getCreatedString,
  isNonEmptyString,
  parseMarkupText,
} from '../data/Util'

//@VisibleForTesting
export const Labels = Object.freeze({
  link: 'Click to follow link',
  collapsed: 'Click to expand post',
  expanded: 'Click to collapse post',
  image: 'Primary content of post',
})

const Post = ({ post, active, loading }) => {
  const dispatch = useContext(AppDispatchContext)

  const { id, title, author, created, postText, url, isImage } = post

  const postBodyContent = isNonEmptyString(postText) ? (
    <span className="text">{parseMarkupText(postText)}</span>
  ) : isImage ? (
    <img src={url} alt={Labels.image} />
  ) : null

  const isContent = postBodyContent !== null

  const buttonClicked = () => {
    if (isContent) {
      dispatch({ type: Actions.TOGGLE_POST, toggledPost: id })
    } else {
      dispatch({ type: Actions.TOGGLE_POST, toggledPost: -1 })
    }
  }

  if (isContent) {
    return (
      <section
        className={classNames('post', { selected: active })}
        aria-labelledby={`${id}Label`}
      >
        <button
          className={classNames('container', { loading })}
          {...{ 'aria-expanded': active }}
          onClick={buttonClicked}
        >
          <div className="topBar">
            <div className="content contentHeader">
              <h3 className="text" id={`${id}Label`}>
                {title}
              </h3>
              <p className="posted text">
                Posted by u/{author}
                <Clock />
                {getCreatedString(created)}
              </p>
            </div>
            <div className="iconSidebar">
              {active ? <ExpandedIcon /> : <CollapsedIcon />}
            </div>
          </div>
          {active ? (
            <p className="content contentBody text">{postBodyContent}</p>
          ) : null}
        </button>
      </section>
    )
  } else {
    return (
      <section
        className={classNames('post', { selected: active })}
        aria-labelledby={`${id}Label`}
      >
        <div className="container">
          <a
            href={url}
            className={classNames({ loading })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={buttonClicked}
          >
            <div className="topBar">
              <div className="content contentHeader">
                <h3 className="text" id={`${id}Label`}>
                  {title}
                </h3>
                <p className="posted text">
                  Posted by u/{author}
                  <Clock />
                  {getCreatedString(created)}
                </p>
              </div>
              <div className="iconSidebar">
                <LinkIcon />
              </div>
            </div>
            <p className="content contentBody text">{postBodyContent}</p>
          </a>
        </div>
      </section>
    )
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
}

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-external-link"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label={Labels.link}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
    <line x1="10" y1="14" x2="20" y2="4" />
    <polyline points="15 4 20 4 20 9" />
  </svg>
)

const CollapsedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-square-plus"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label={Labels.collapsed}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="12" y1="9" x2="12" y2="15" />
  </svg>
)

const ExpandedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-square-minus"
    width="44"
    height="44"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label={Labels.expanded}
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="9" y1="12" x2="15" y2="12" />
  </svg>
)

const Clock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-clock"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" />
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
)

export default Post
