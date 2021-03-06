import test from 'ava'

import webmachine, { ResourceConfig } from './webmachine'
import * as Http from './http'

type MyError = { error: string }
interface MyThing {
  foo: string
  bar: boolean
}
type MyThingCollection = { items: MyThing[]; meta: string }
type MyResponse = MyError | MyThing | MyThingCollection

const GET = (headers: Http.Headers = {}) => ({ method: 'GET', headers, url: '', body: '' })

const PUT = (body: Http.Body, headers: Http.Headers = {}) => ({
  method: 'PUT',
  headers,
  url: '',
  body,
})

const jsonPUT = (body: any, headers: Http.Headers = {}) => PUT(JSON.stringify(body), headers)

test('GET minimal resource', async t => {
  const foo = { foo: 'asdf', bar: false }
  const result = await webmachine({ 'handle-ok': foo }, GET())

  t.is(result.status, 200)
  t.is(result.body, JSON.stringify(foo))
})

test('GET + PUT minimal resource', async t => {
  const initialEntity = { foo: 'bar' }
  type Entity = Record<string, any>
  const state: { entity: Entity } = {
    entity: initialEntity,
  }
  let entity: Entity | null = null
  const resource: Partial<ResourceConfig<Entity>> = {
    'allowed-methods': ['GET', 'PUT'],
    'handle-ok': () => state.entity,
    'new?': false,
    'respond-with-entity?': true,
    'malformed?': async context => {
      const body = await Http.readBody(context.request.body)
      if (body.length < 1) return false
      try {
        entity = JSON.parse(body)
      } catch (e) {
        return true
      }
      return false
    },
    'put!': () => {
      if (entity === null) throw new Error()
      state.entity = entity
    },
  }
  const payload = { lorem: 'ipsum' }
  const result = await webmachine(resource, jsonPUT(payload, { 'x-webmachine-trace': 'enable' }))

  // console.dir(result, { depth: 10 })
  t.is(result.status, 200)
  t.truthy(result.body)

  const body = await Http.readBody(result.body!)
  t.deepEqual(JSON.parse(body), payload)

  const result2 = await webmachine(resource, GET())
  if (!result2.body) {
    t.fail()
    return
  }
  const body2 = await Http.readBody(result2.body)
  t.deepEqual(JSON.parse(body2), payload)
  //TODO
})

test('readHttpBody', async t => {
  const b = Buffer.from('aöb')
  const body = {
    [Symbol.asyncIterator]: async function* () {
      yield b.slice(0, 2)
      yield b.slice(2)
    },
  }
  const x = await Http.readBody(body)
  t.is(x, 'aöb')
})
