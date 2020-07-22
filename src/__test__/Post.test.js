import React from 'react'
import { render, screen } from '@testing-library/react'

import { getCreatedString } from '../data/Util'

import Post, { Labels } from '../components/Post'

describe('<Post> unit tests', () => {
  const exampleState = {
    id: '23fv5h',
    title: 'My post is awesome',
    author: 'johnDoe',
    created: 1500000000,
    postText: null,
    url: 'http://www.reddit.com',
    isImage: null,
  }

  const verifyBasePostContent = (state) => {
    expect(screen.getByText(exampleState.title)).toBeInTheDocument()
    expect(
      screen.getByText(exampleState.author, { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText(getCreatedString(exampleState.created), {
        exact: false,
      })
    ).toBeInTheDocument()
  }

  test('should display basic link post content', () => {
    const linkOnlyPostContent = { ...exampleState }
    const propObj = {
      post: linkOnlyPostContent,
      active: false,
      loading: false,
    }
    render(<Post {...propObj} />)

    // Post content
    verifyBasePostContent(linkOnlyPostContent)

    // Posts with no body and isImage=false should be link type post
    expect(screen.queryByLabelText(Labels.link)).not.toBeNull()
    expect(screen.queryByLabelText(Labels.collapsed)).toBeNull()
    expect(screen.queryByLabelText(Labels.expanded)).toBeNull()
  })

  test('should display inactive posts with text content properly with bodies hidden', () => {
    const textBodyPostContent = {
      ...exampleState,
      postText: 'This is the body of the post',
    }
    const propObj = {
      post: textBodyPostContent,
      active: false,
      loading: false,
    }
    render(<Post {...propObj} />)

    // Post content
    verifyBasePostContent(textBodyPostContent)

    // Posts with a body and isImage=false should be an expandable post
    expect(screen.queryByLabelText(Labels.link)).toBeNull()
    expect(screen.queryByLabelText(Labels.collapsed)).not.toBeNull()
    expect(screen.queryByLabelText(Labels.expanded)).toBeNull()

    // Should be collapsed
    expect(screen.queryByText(textBodyPostContent.postText)).toBeNull()
  })

  test('should display active posts with text content properly with bodies visible', () => {
    const textBodyPostContent = {
      ...exampleState,
      postText: 'This is the body of the post',
    }
    const propObj = {
      post: textBodyPostContent,
      active: true,
      loading: false,
    }
    render(<Post {...propObj} />)

    // Post content
    verifyBasePostContent(textBodyPostContent)

    // Posts with a body and isImage=false should be an expandable post
    expect(screen.queryByLabelText(Labels.link)).toBeNull()
    expect(screen.queryByLabelText(Labels.collapsed)).toBeNull()
    expect(screen.queryByLabelText(Labels.expanded)).not.toBeNull()

    // Should be expanded
    expect(screen.queryByText(textBodyPostContent.postText)).not.toBeNull()
  })

  test('should display inactive posts with image content properly with bodies hidden', () => {
    const imageBodyPostContent = {
      ...exampleState,
      isImage: true,
    }
    const propObj = {
      post: imageBodyPostContent,
      active: false,
      loading: false,
    }
    render(<Post {...propObj} />)

    // Post content
    verifyBasePostContent(imageBodyPostContent)

    // Posts with no body and isImage=true should be an expandable post
    expect(screen.queryByLabelText(Labels.link)).toBeNull()
    expect(screen.queryByLabelText(Labels.collapsed)).not.toBeNull()
    expect(screen.queryByLabelText(Labels.expanded)).toBeNull()

    // Should be collapsed
    expect(screen.queryByAltText(Labels.image)).toBeNull()
  })

  test('should display active posts with image content properly with bodies visible', () => {
    const imageBodyPostContent = {
      ...exampleState,
      isImage: true,
    }
    const propObj = {
      post: imageBodyPostContent,
      active: true,
      loading: false,
    }
    render(<Post {...propObj} />)

    // Post content
    verifyBasePostContent(imageBodyPostContent)

    // Posts with no body and isImage=true should be an expandable post
    expect(screen.queryByLabelText(Labels.link)).toBeNull()
    expect(screen.queryByLabelText(Labels.collapsed)).toBeNull()
    expect(screen.queryByLabelText(Labels.expanded)).not.toBeNull()

    // Should be expanded
    expect(screen.queryByAltText(Labels.image)).not.toBeNull()
  })
})
