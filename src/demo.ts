import http from 'http'
import { Resource } from './webmachine'
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

const handleRequest = requestHandler(route)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080

const server = http.createServer()
server.on('request', handleRequest)
server.listen(port, () => {
  console.log(`listening on port ${port}`)
})
