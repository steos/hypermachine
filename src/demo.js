import * as R from 'ramda'
import server from './server'
import router from './router'

const db = { '123': { id: '123', text: 'bla', done: false } }

const todoRoutes = {
  '/todos': {
    'handle-ok': R.values(db),
  },
  '/todos/{id}': ({ id }) => {
    if (db[id] == null) return null
    return {
      'handle-ok': db[id],
    }
  },
}

server(router(todoRoutes))
