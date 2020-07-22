import React from 'react'
import reactStringReplace from 'react-string-replace'

export const isNonEmptyString = (value) => {
  return (
    value !== undefined &&
    value !== null &&
    typeof value === 'string' &&
    value.trim() !== ''
  )
}

//@VisibleForTesting
export const Duration = Object.freeze({
  MINUTE: 60,
  HOUR: 3600,
  DAY: 86400,
  MONTH: 2592000,
  YEAR: 31556952,
})

export const getCreatedString = (timestamp) => {
  if (typeof timestamp !== 'number') {
    return
  }

  const utcNow = Math.floor(Date.now() / 1000)
  const age = utcNow - timestamp

  if (age < 0) {
    return
  } else if (age < Duration.MINUTE) {
    return 'seconds ago'
  } else if (age < 2 * Duration.MINUTE) {
    return '1 minute ago'
  } else if (age < Duration.HOUR) {
    const minutes = Math.floor(age / Duration.MINUTE)
    return `${minutes} minutes ago`
  } else if (age < 2 * Duration.HOUR) {
    return '1 hour ago'
  } else if (age < Duration.DAY) {
    const hours = Math.floor(age / Duration.HOUR)
    return `${hours} hours ago`
  } else if (age < 2 * Duration.DAY) {
    return `1 day ago`
  } else if (age < Duration.MONTH) {
    const days = Math.floor(age / Duration.DAY)
    return `${days} days ago`
  } else if (age < 2 * Duration.MONTH) {
    return `1 month ago`
  } else if (age < Duration.YEAR) {
    const months = Math.floor(age / Duration.MONTH)
    return `${months} months ago`
  } else if (age < 2 * Duration.YEAR) {
    return `1 year ago`
  } else {
    const years = Math.floor(age / Duration.YEAR)
    return `${years} years ago`
  }
}

export const hexToRGB = (hex) => {
  if (!isNonEmptyString(hex)) {
    return null
  }
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : null
}

const parseNewlines = (textWithNewlines) => {
  return reactStringReplace(textWithNewlines, /(\n)/g, (match, i) => (
    <br key={`br${i}`} />
  ))
}

const capturingLinkPattern = new RegExp(/\[([^\]]+)\]\(([^)]+)\)/)

const parseLinkMarkup = (textWithLinks) => {
  return reactStringReplace(
    textWithLinks,
    /(\[(?:[^\]]+)\]\((?:[^)]+)\))/g,
    (match, i) => {
      const result = capturingLinkPattern.exec(match)
      return (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={result[2]}
          key={`a${i}`}
        >
          {result[1]}
        </a>
      )
    }
  )
}

const parseBoldMarkup = (textWithBold) => {
  return reactStringReplace(textWithBold, /\*\*([^*]+)\*\*/g, (match, i) => (
    <b key={`b${i}`}>{match}</b>
  ))
}

const parseItalicsMarkup = (textWithItalics) => {
  return reactStringReplace(textWithItalics, /\*([^*]+)\*/g, (match, i) => (
    <em key={`em${i}`}>{match}</em>
  ))
}

export const parseMarkupText = (markupText) => {
  if (!isNonEmptyString(markupText)) {
    return
  }
  let tempText = markupText.replace(/&#x200B;/g, '')
  tempText = parseNewlines(tempText)
  tempText = parseLinkMarkup(tempText)
  tempText = parseBoldMarkup(tempText)
  tempText = parseItalicsMarkup(tempText)
  return tempText
}
