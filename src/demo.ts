import webmachine, { HttpRequest, ResourceConfig, Context } from './webmachine'
import { IncomingMessage } from 'http'

type MyError = { error: string }
interface MyThing {
  foo: string
  bar: boolean
}
type MyThingCollection = { items: MyThing[]; meta: string }
type MyResponse = MyError | MyThing | MyThingCollection

const requestFromIncomingMessage = (req: IncomingMessage): HttpRequest => {
  if (req.method == null) throw new Error()
  if (req.url == null) throw new Error()
  return { method: req.method, url: req.url, headers: req.headers, body: req }
}

const resource: Partial<ResourceConfig<MyThing | MyError>> = {
  'handle-ok': { foo: 'asdf', bar: false },
  'handle-malformed': { error: 'bla' },
  'malformed?': async (context: Context) => {
    const body: Buffer[] = []
    for await (let chunk of context.request.body) {
      body.push(chunk)
    }
    // context.body = Buffer.concat(body)
    return false
  },
}

webmachine(resource, {
  method: 'GET',
  headers: { 'x-webmachine-trace': 'enable' },
  url: '',
  body: '',
}).then(res => {
  console.log(res)
})
