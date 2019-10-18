import test from 'ava'
import { negotiateMediaType } from './http-utils'

test('negotiateMediaType with q=0 and multiple acceptable', t => {
  const type = negotiateMediaType('text/*, text/html;q=0, text/json', [
    'text/html',
    'text/plain',
    'text/json',
  ])
  t.is(type, 'text/json')
})

test('negotiateMediaType with q=0 and single acceptable', t => {
  const type = negotiateMediaType('text/*, text/html;q=0', ['text/html', 'text/plain'])
  t.is(type, 'text/plain')
})

test('negotiateMediaType with no acceptable', t => {
  const type = negotiateMediaType('text/*, text/html;q=0', ['text/html'])
  t.is(type, null)
})
