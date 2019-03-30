import test from 'ava'
import { matchPathSpec, stringToPathSpec, matchSegment } from './router'

test('stringToPathSpec', t => {
  const spec = stringToPathSpec('/todos/{id}')
  t.deepEqual(spec, [
    { type: 'literal', value: 'todos' },
    { type: 'variable', value: 'id' },
  ])
})

test('matchSegment', t => {
  const m = matchSegment({ type: 'variable', value: 'id' }, '123')
  t.deepEqual(m, ['id', '123'])
})

test('matchPathSpec', t => {
  const match = matchPathSpec(stringToPathSpec('/todos/{id}'), ['todos', '123'])
  t.deepEqual(match, { id: '123' })
})
