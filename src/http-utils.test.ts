import test from 'ava'
import { negotiateMediaType, NegotiatedMediaType } from './http-utils'

const mediaRange = (mediaType: string, quality: number = 1): NegotiatedMediaType => {
  return { type: mediaType, quality, params: [] }
}

test('negotiateMediaType with q=0 and multiple acceptable', t => {
  const type = negotiateMediaType('text/*, text/html;q=0, text/json', [
    'text/html',
    'text/plain',
    'text/json',
  ])
  t.deepEqual(type, mediaRange('text/json'))
})

test('negotiateMediaType with q=0 and single acceptable', t => {
  const type = negotiateMediaType('text/*, text/html;q=0', ['text/html', 'text/plain'])
  t.deepEqual(type, mediaRange('text/plain'))
})

test('negotiateMediaType with no acceptable', t => {
  const type = negotiateMediaType('text/*, text/html;q=0', ['text/html'])
  t.is(type, null)
})

test('negotiateMediaType with multiple quality values', t => {
  const type = negotiateMediaType('text/html; q=0.5, text/json; q=0.8', ['text/html', 'text/json'])
  t.deepEqual(type, mediaRange('text/json', 0.8))
})
