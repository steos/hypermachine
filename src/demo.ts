import http, { IncomingMessage, ServerResponse } from 'http'
import webmachine, { Resource } from './webmachine'
import router, { RouteArgs, RouteTable } from './router'

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

const collectionResource: Resource<Todo[]> = {
  'handle-ok': () => Object.values(todos),
}

const entityResource = ({ id }: RouteArgs): Resource<Todo> | null => {
  const todo = todos[id]
  if (!todo) return null
  return {
    'allowed-methods': ['HEAD', 'GET', 'PUT'],
    'new?': false,
    'respond-with-entity?': true,
    'handle-ok': todo,
    'malformed?': context => {
      //TODO
      return false
    },
    'put!': () => {
      //TODO
    },
  }
}

const todoRoutes: RouteTable<Resource<any>> = {
  '/todos': collectionResource,
  '/todos/{id}': entityResource,
}

const route = router(todoRoutes)

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
  if (!req.url) throw new Error()
  if (!req.method) throw new Error()
  const resource = await route(req.url)
  if (resource === null) {
    res.writeHead(404)
    res.end()
    return
  }
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
  //   console.dir(response, { depth: 10 })
  res.writeHead(response.status, response.headers)
  if (response.body) {
    if (typeof response.body === 'string') {
      res.write(response.body)
    } else {
      for await (const chunk of response.body) {
        res.write(chunk)
      }
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
