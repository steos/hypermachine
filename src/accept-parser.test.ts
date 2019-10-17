import test from 'ava'
import acceptHeader from './accept-header'

test('foo/bar', t => {
  const result = acceptHeader.parse('foo/bar')
  t.assert(result.length === 1)
  const [[mediaRanges, remaining]] = result
  t.assert(mediaRanges.length === 1)
  t.is(remaining, '')
  const m = mediaRanges[0]
  t.is(m.type, 'foo')
  t.is(m.subtype, 'bar')
  t.is(m.quality, 1)
  t.assert(m.params.length === 0)
})

test('foo/bar;q=0.123', t => {
  const result = acceptHeader.parse('foo/bar;q=0.123')
  t.assert(result.length === 1)
  const [[mediaRanges, remaining]] = result
  t.assert(mediaRanges.length === 1)
  t.is(remaining, '')
  const m = mediaRanges[0]
  t.is(m.type, 'foo')
  t.is(m.subtype, 'bar')
  t.is(m.quality, 0.123)
  t.assert(m.params.length === 0)
})

test('foo/bar;baz=quux', t => {
  const result = acceptHeader.parse('foo/bar;baz=quux')
  t.assert(result.length === 1)
  const [[mediaRanges, remaining]] = result
  t.assert(mediaRanges.length === 1)
  t.is(remaining, '')
  const m = mediaRanges[0]
  t.is(m.type, 'foo')
  t.is(m.subtype, 'bar')
  t.is(m.quality, 1)
  t.deepEqual(m.params, [{ name: 'baz', value: 'quux' }])
})

test('foo/bar;baz=quux, text/*;q=0.7 */*;q=0.5', t => {
  const result = acceptHeader.parse('foo/bar;baz=quux, text/*;q=0.7, */*;q=0.5')
  t.assert(result.length === 1)
  const [[ms]] = result
  t.deepEqual(ms, [
    { type: 'foo', subtype: 'bar', quality: 1, params: [{ name: 'baz', value: 'quux' }] },
    { type: 'text', subtype: '*', quality: 0.7, params: [] },
    { type: '*', subtype: '*', quality: 0.5, params: [] },
  ])
})

test('audio/*; q=0.2, audio/basic', t => {
  const result = acceptHeader.parse('audio/*; q=0.2, audio/basic')
  t.assert(result.length === 1)
  const [[ms, remaining]] = result
  t.is(remaining, '')
  t.deepEqual(ms, [
    { type: 'audio', subtype: '*', quality: 0.2, params: [] },
    { type: 'audio', subtype: 'basic', quality: 1, params: [] },
  ])
})

test('text/*  ;  q=0.2  ,  text/html', t => {
  const result = acceptHeader.parse('text/*  ;  q=0.2  ,  text/html')
  t.assert(result.length === 1)
  const [[ms, remaining]] = result
  t.is(remaining, '')
  t.deepEqual(ms, [
    { type: 'text', subtype: '*', quality: 0.2, params: [] },
    { type: 'text', subtype: 'html', quality: 1, params: [] },
  ])
})
