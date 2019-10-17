import test from 'ava'

import webmachine, { HttpRequest, ResourceConfig, Context } from './webmachine'
import * as wm from './webmachine'
import { IncomingMessage } from 'http'

type MyError = { error: string }
interface MyThing {
  foo: string
  bar: boolean
}
type MyThingCollection = { items: MyThing[]; meta: string }
type MyResponse = MyError | MyThing | MyThingCollection

const config: wm.Config<MyResponse> = {
  serializers: {
    'application/json': x => JSON.stringify(x),
  },
}

const webm = webmachine(config)

test('minimal resource', async t => {
  const body = { foo: 'asdf', bar: false }
  const resource: Partial<ResourceConfig<MyThing | MyError>> = {
    'handle-ok': body,
    'handle-malformed': { error: 'bla' },
    'malformed?': async (context: Context) => {
      const body: Buffer[] = []
      for await (let chunk of context.request.body) {
        body.push(chunk)
      }
      return false
    },
  }

  const result = await webm(resource, {
    method: 'GET',
    headers: { 'x-webmachine-trace': 'enable' },
    url: '',
    body: '',
  })

  t.is(result.status, 200)
  t.is(result.body, JSON.stringify(body))
})
