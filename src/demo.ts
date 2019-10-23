import http from 'http'
import { Resource, HttpBody } from './webmachine'
import router, { RouteArgs, RouteTable } from './router'
import requestHandler from './request-handler'

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

const readBody = async (body: HttpBody, encoding: string = 'utf8') => {
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

type EntityContext = {
  entity: any
}

const entityResource = ({ id }: RouteArgs): Resource<Todo, EntityContext> | null => {
  if (!todos[id]) return null
  return {
    'allowed-methods': ['HEAD', 'GET', 'PUT'],
    'new?': false,
    'respond-with-entity?': true,
    'handle-ok': () => todos[id],
    'malformed?': async context => {
      //TODO
      if (!context.request.body) return false
      const body = await readBody(context.request.body)
      if (body.length < 1) return false
      //   console.log('body', body)
      try {
        context.entity = JSON.parse(body)
      } catch (e) {
        return true
      }
      return false
    },
    'put!': context => {
      //   console.log('PUT!', context.entity)
      todos[id] = context.entity
    },
  }
}

const todoRoutes: RouteTable<Resource<any>> = {
  '/todos': collectionResource,
  '/todos/{id}': entityResource,
}

const route = router(todoRoutes)

const handleRequest = requestHandler(route)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080

const server = http.createServer()
server.on('request', handleRequest)
server.listen(port, () => {
  console.log(`listening on port ${port}`)
})
