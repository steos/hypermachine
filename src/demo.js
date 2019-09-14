import * as R from 'ramda'
import router from './router'
import http from 'http'
import requestHandler from './request-handler'
import webmachine from './webmachine'

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

const handleRequest = requestHandler(router(todoRoutes), webmachine())
const server = http.createServer()
server.on('request', handleRequest)
server.listen(8080)
