import test from 'ava'

import webmachine, { ResourceConfig, HttpHeaders, HttpBody } from './webmachine'

type MyError = { error: string }
interface MyThing {
  foo: string
  bar: boolean
}
type MyThingCollection = { items: MyThing[]; meta: string }
type MyResponse = MyError | MyThing | MyThingCollection

const GET = (headers: HttpHeaders = {}) => ({ method: 'GET', headers, url: '', body: '' })

const PUT = (body?: HttpBody, headers: HttpHeaders = {}) => ({
  method: 'PUT',
  headers,
  url: '',
  body,
})

const jsonPUT = (body: any, headers: HttpHeaders = {}) => PUT(JSON.stringify(body), headers)

const readBody = async (body: HttpBody, encoding: string = 'utf8'): Promise<string> => {
  if (typeof body === 'string') return body
  let str = ''
  for await (let chunk of body) {
    if (typeof chunk === 'string') {
      str += chunk
    } else if (chunk instanceof Buffer) {
      str += chunk.toString(encoding)
    }
  }
  return str
}

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
      if (context.request.body) {
        const body = await readBody(context.request.body)
        try {
          entity = JSON.parse(body)
        } catch (e) {
          return true
        }
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

  console.dir(result, { depth: 10 })
  t.is(result.status, 200)

  if (!result.body) {
    t.fail()
    return
  }
  const body = await readBody(result.body)
  t.deepEqual(JSON.parse(body), payload)

  const result2 = await webmachine(resource, GET())
  if (!result2.body) {
    t.fail()
    return
  }
  const body2 = await readBody(result2.body)
  t.deepEqual(JSON.parse(body2), payload)
  //TODO
})
