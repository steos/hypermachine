import {
  parser as acceptParser,
  MediaRange,
  Parameter as MediaParam,
  compareMediaRange,
  MediaType,
} from './accept-header'

const wkday = '(Mon|Tue|Wed|Thu|Fri|Sat|Sun)'
const month = '(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)'
const time = '\\d{2}:\\d{2}:\\d{2}'

const rfc1123 = new RegExp(`^${wkday}, \\d{2} ${month} \\d{4} ${time} GMT$`)

// see https://tools.ietf.org/html/rfc2616#section-3.3

export const parseDate = (s: string): Date | null => {
  if (rfc1123.test(s)) {
    return new Date(s)
  }
  return null
}

const mediaTypesMatch = (a: MediaType, b: MediaType) => {
  if (a.type === '*' && b.subtype === '*') return true
  if (a.subtype === '*') return a.type === b.type
  return a.type === b.type && a.subtype === b.subtype
}

const mediaRangeSatisfiesType = (range: MediaRange, mediaType: MediaType) =>
  range.quality > 0 && mediaTypesMatch(range, mediaType)

const parseMediaType = (x: string): MediaType => {
  const [type, subtype] = x.split('/')
  return { type, subtype }
}

export interface NegotiatedMediaType {
  type: string
  params: MediaParam[]
  quality: number
}

export const negotiateMediaType = (
  accept: string,
  available: string[]
): NegotiatedMediaType | null => {
  const result = acceptParser.parse(accept)
  if (result.length < 1) {
    throw new Error('malformed accept header')
  }
  const [[mediaRanges]] = result
  mediaRanges.sort(compareMediaRange)

  const acceptable = available.filter(
    type =>
      !mediaRanges.some(
        range => mediaTypesMatch(range, parseMediaType(type)) && range.quality === 0
      )
  )
  for (let mediaRange of mediaRanges) {
    for (let type of acceptable) {
      if (mediaRangeSatisfiesType(mediaRange, parseMediaType(type)))
        return { type: type, quality: mediaRange.quality, params: mediaRange.params }
    }
  }
  return null
}
