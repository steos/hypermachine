import http from 'http'
import { Resource, readHttpBody, Context } from './webmachine'
import router, { RouteArgs, RouteTable } from './router'
import requestHandler from './request-handler'

type Todo = {
  id: string
  text: string
  done: boolean
}

type Db = {
  todos: Record<string, Todo>
  nextId: number
}

const db: Db = {
  todos: {
    _1: { id: '_1', text: 'lorem ipsum', done: false },
    _2: { id: '_2', text: 'foo bar', done: true },
  },
  nextId: 3,
}

type TodoPayload = Partial<Omit<Todo, 'id'>>

const json = (onSuccess: (x: any) => void) => async (context: Context) => {
  const body = await readHttpBody(context.request.body)
  if (body.length < 1) return false
  try {
    // TODO this is not safe, use io-ts
    const entity = JSON.parse(body)
    if (entity === null) return true
    onSuccess(entity)
  } catch (e) {
    return true
  }
  return false
}

const collectionResource: () => Resource<Todo[]> = () => {
  let entity: any = null
  let todo: Todo | null = null
  return {
    'allowed-methods': ['HEAD', 'GET', 'POST'],
    'malformed?': json(x => {
      entity = x
    }),
    'post!': () => {
      //TODO
      const id = `_${db.nextId}`
      todo = { ...entity, id }
      db.todos[id] = todo!
      db.nextId++
      //   console.log('post!', entity)
    },
    'handle-ok': () => Object.values(db.todos),
    'handle-created': () => entity,
  }
}

const entityResource = ({ id }: RouteArgs): Resource<Todo> | null => {
  if (!db.todos[id]) return null
  let entity: TodoPayload | null = null
  return {
    'allowed-methods': ['HEAD', 'GET', 'PUT'],
    'new?': false,
    'respond-with-entity?': true,
    'handle-ok': () => db.todos[id],
    'malformed?': json(x => {
      entity = x
    }),
    'put!': () => {
      if (entity === null) throw new Error()
      const todo: Todo = { ...db.todos[id], ...entity, id }
      db.todos[id] = todo
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
