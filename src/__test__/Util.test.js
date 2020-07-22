import React from 'react'
import TestRenderer from 'react-test-renderer'

import {
  isNonEmptyString,
  Duration,
  getCreatedString,
  hexToRGB,
  parseMarkupText,
} from '../data/Util'

describe('isNonEmptyString() unit test', () => {
  test('should return false for "uninitialized" input', () => {
    expect(isNonEmptyString(null)).toEqual(false)
    expect(isNonEmptyString(undefined)).toEqual(false)
  })
  test('should return false for whitespace-only initialized input', () => {
    expect(isNonEmptyString('')).toEqual(false)
    expect(isNonEmptyString('    ')).toEqual(false)
    expect(isNonEmptyString('\n')).toEqual(false)
    expect(isNonEmptyString('  \t \n  ')).toEqual(false)
  })
  test('should return false for non-string input', () => {
    expect(isNonEmptyString(false)).toEqual(false)
    expect(isNonEmptyString(true)).toEqual(false)
    expect(isNonEmptyString(1234)).toEqual(false)
    expect(isNonEmptyString({ label: 'test' })).toEqual(false)
  })
  test('should return true for non empty string input', () => {
    expect(isNonEmptyString('pants')).toEqual(true)
    expect(isNonEmptyString('ba na na')).toEqual(true)
    expect(isNonEmptyString(' test ')).toEqual(true)
  })
})

describe('getCreatedString() unit test', () => {
  const NOW_MILLIS = 1600000000000

  const RealDate = Date.now
  beforeAll(() => {
    global.Date.now = jest.fn(() => NOW_MILLIS)
  })
  afterAll(() => {
    global.Date.now = RealDate
  })

  test('should return nothing for non-number input', () => {
    expect(getCreatedString(false)).toBeUndefined()
    expect(getCreatedString(true)).toBeUndefined()
    expect(getCreatedString('test')).toBeUndefined()
    expect(getCreatedString('1234')).toBeUndefined()
    expect(getCreatedString({ label: 'test' })).toBeUndefined()
  })
  test('should return string value for number input', () => {
    const NOW_SECS = NOW_MILLIS / 1000

    const fiveSecondsAgo = NOW_SECS - 5
    expect(getCreatedString(fiveSecondsAgo)).toEqual('seconds ago')

    const fiftySecondsAgo = NOW_SECS - 50
    expect(getCreatedString(fiftySecondsAgo)).toEqual('seconds ago')

    const minuteFiveSecondsAgo = NOW_SECS - 65
    expect(minuteFiveSecondsAgo + 1 * Duration.MINUTE + 5).toEqual(NOW_SECS)
    expect(getCreatedString(minuteFiveSecondsAgo)).toEqual('1 minute ago')

    const fiveMinutesAgo = NOW_SECS - 300
    expect(fiveMinutesAgo + 5 * Duration.MINUTE).toEqual(NOW_SECS)
    expect(getCreatedString(fiveMinutesAgo)).toEqual('5 minutes ago')

    const fiftyMinutesAgo = NOW_SECS - 3000
    expect(fiftyMinutesAgo + 50 * Duration.MINUTE).toEqual(NOW_SECS)
    expect(getCreatedString(fiftyMinutesAgo)).toEqual('50 minutes ago')

    const hourFiveMinutesAgo = NOW_SECS - 3900
    expect(
      hourFiveMinutesAgo + 1 * Duration.HOUR + 5 * Duration.MINUTE
    ).toEqual(NOW_SECS)
    expect(getCreatedString(hourFiveMinutesAgo)).toEqual('1 hour ago')

    const fiveHoursAgo = NOW_SECS - 18000
    expect(fiveHoursAgo + 5 * Duration.HOUR).toEqual(NOW_SECS)
    expect(getCreatedString(fiveHoursAgo)).toEqual('5 hours ago')

    const thirtyHoursAgo = NOW_SECS - 108000
    expect(thirtyHoursAgo + 30 * Duration.HOUR).toEqual(NOW_SECS)
    expect(getCreatedString(thirtyHoursAgo)).toEqual('1 day ago')

    const fiveDaysAgo = NOW_SECS - 432000
    expect(fiveDaysAgo + 5 * Duration.DAY).toEqual(NOW_SECS)
    expect(getCreatedString(fiveDaysAgo)).toEqual('5 days ago')

    const fiftyDaysAgo = NOW_SECS - 4320000
    expect(fiftyDaysAgo + 50 * Duration.DAY).toEqual(NOW_SECS)
    expect(getCreatedString(fiftyDaysAgo)).toEqual('1 month ago')

    const fiveMonthsAgo = NOW_SECS - 12960000
    expect(fiveMonthsAgo + 5 * Duration.MONTH).toEqual(NOW_SECS)
    expect(getCreatedString(fiveMonthsAgo)).toEqual('5 months ago')

    const fifteenMonthsAgo = NOW_SECS - 38880000
    expect(fifteenMonthsAgo + 15 * Duration.MONTH).toEqual(NOW_SECS)
    expect(getCreatedString(fifteenMonthsAgo)).toEqual('1 year ago')

    const fiveYearsAgo = NOW_SECS - 157784760
    expect(fiveYearsAgo + 5 * Duration.YEAR).toEqual(NOW_SECS)
    expect(getCreatedString(fiveYearsAgo)).toEqual('5 years ago')
  })

  test('should return nothing times in the future', () => {
    expect(getCreatedString(NOW_MILLIS / 1000 + 384)).toBeUndefined()
    expect(getCreatedString(NOW_MILLIS / 1000 + 12243)).toBeUndefined()
  })
})

describe('hexToRGB() unit test', () => {
  test('should return null for non-string values', () => {
    expect(hexToRGB(false)).toBeNull()
    expect(hexToRGB(true)).toBeNull()
    expect(hexToRGB(1234)).toBeNull()
    expect(hexToRGB({ label: 'test' })).toBeNull()
  })
  test('should return null for non hexcode string values', () => {
    expect(hexToRGB('pants')).toBeNull()
    expect(hexToRGB('133, 123, 423')).toBeNull()
    expect(hexToRGB('133 123 423')).toBeNull()
    expect(hexToRGB('black')).toBeNull()
    expect(hexToRGB('#pantss')).toBeNull()
    expect(hexToRGB('#12vv45')).toBeNull()
  })
  test('should return rgb values for proper hexcode string values', () => {
    expect(hexToRGB('#112244')).toEqual('17, 34, 68')
    expect(hexToRGB('112244')).toEqual('17, 34, 68')
    expect(hexToRGB('#aabbcc')).toEqual('170, 187, 204')
    expect(hexToRGB('aabbcc')).toEqual('170, 187, 204')
  })
})

describe('parseMarkupText() unit test', () => {
  test('should return nothing for non-number input', () => {
    expect(parseMarkupText(false)).toBeUndefined()
    expect(parseMarkupText(true)).toBeUndefined()
    expect(parseMarkupText(1234)).toBeUndefined()
    expect(parseMarkupText({ label: 'test' })).toBeUndefined()
  })
  test("should replace new lines with <br />'s", () => {
    const textWithNewlines = 'Hello\nworld'
    const element = TestRenderer.create(
      <p>{parseMarkupText(textWithNewlines)}</p>
    ).toJSON()
    expect(element).toMatchSnapshot()
  })
  test("should replace adjacent new lines with multiple <br />'s", () => {
    const textWithNewlines = 'Hello\n\n\nworld'
    const element = TestRenderer.create(
      <p>{parseMarkupText(textWithNewlines)}</p>
    ).toJSON()
    expect(element).toMatchSnapshot()
  })
  test('should wrap bold markup in <b>', () => {
    const textWithBoldMarkup = 'This **is** a test'
    const element = TestRenderer.create(
      <p>{parseMarkupText(textWithBoldMarkup)}</p>
    ).toJSON()
    expect(element).toMatchSnapshot()
  })
  test('should wrap italics markup in <em>', () => {
    const textWithItalicsMarkup = 'This is *a* test'
    const element = TestRenderer.create(
      <p>{parseMarkupText(textWithItalicsMarkup)}</p>
    ).toJSON()
    expect(element).toMatchSnapshot()
  })
  test('should process link markup into proper <a href>', () => {
    const textWithLinkMarkup = 'This is a [test](www.test.com)'
    const element = TestRenderer.create(
      <p>{parseMarkupText(textWithLinkMarkup)}</p>
    ).toJSON()
    expect(element).toMatchSnapshot()
  })
  test('should process multiple markup types into proper elements', () => {
    const textWithMarkup =
      'Hello world!\n\nThis **is** *a* [test](www.test.com).'
    const element = TestRenderer.create(
      <p>{parseMarkupText(textWithMarkup)}</p>
    ).toJSON()
    expect(element).toMatchSnapshot()
  })
})
