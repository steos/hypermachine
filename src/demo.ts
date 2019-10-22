import http, { IncomingMessage, ServerResponse } from 'http'
import webmachine, { Resource } from './webmachine'

type Todo = {
  id: string
  text: string
  done: boolean
}

type TodoDb = Record<string, Todo>

const todos: TodoDb = {
  _1: { id: '_1', text: 'lorem ipsum', done: false },
  _2: { id: '_2', text: 'foo bar', done: true },
}

type Lazy<T> = T | Promise<T> | (() => T | Promise<T>)

type RouteValue<T> = Lazy<T | null>

type RouteArgs = Record<string, RouteValue<any>>

// type RoutingTable

const collectionResource: RouteValue<Resource<TodoDb>> = {
  'handle-ok': () => todos,
}

const entityResource = ({ id }: RouteArgs): RouteValue<Resource<Todo>> => {
  const todo = todos[id]
  if (!todo) return null
  return {
    'allowed-methods': ['HEAD', 'GET', 'PUT'],
    'new?': false,
    'respond-with-entity?': true,
    'handle-ok': todos[id],
    'malformed?': context => {
      //TODO
      return false
    },
    'put!': () => {
      //TODO
    },
  }
}

const todoRoutes = {
  '/todos': collectionResource,
  '/todos/{id}': entityResource,
}

interface VarSegment {
  kind: 'var'
  name: string
}
interface LiteralSegment {
  kind: 'literal'
  value: string
}
type RouteSegment = VarSegment | LiteralSegment

const parsePathSegment = (segment: string): RouteSegment => {
  if (segment.startsWith('{') && segment.endsWith('}')) {
    return { kind: 'var', name: segment.substring(0, segment.length - 1) }
  } else {
    return { kind: 'literal', value: segment }
  }
}

const router = (routes: Record<string, any>) => (path: string) => {
  const segments = path.split('/').map(parsePathSegment)

  const match = routes[segments[0]]
  if (match) {
    //TODO
    return match
  }
  return null
}

const route = router(todoRoutes)

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
  //TODO
  if (!req.url) throw new Error()
  if (!req.method) throw new Error()
  const resource = route(req.url)
  const response = await webmachine(
    resource,
    {
      method: req.method,
      headers: req.headers,
      url: req.url,
      body: req,
    },
    {}
  )
  res.writeHead(response.status, response.headers)
  if (response.body) {
    for await (const chunk of response.body) {
      res.write(chunk)
    }
  }
  res.end()
}

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080

const server = http.createServer()
server.on('request', handleRequest)
server.listen(port, () => {
  console.log(`listening on port ${port}`)
})
