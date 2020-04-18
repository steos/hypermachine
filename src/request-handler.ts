import { IncomingMessage, ServerResponse } from 'http'
import webmachine, { Resource } from './webmachine'
import { Router } from './router'

const requestHandler = <T extends Resource<any>>(route: Router<T>) => async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (!req.url) throw new Error()
  if (!req.method) throw new Error()
  const resource = await route(req.url)
  if (resource === null) {
    res.writeHead(404)
    res.end()
    return
  }
  const response = await webmachine(resource, {
    method: req.method,
    headers: req.headers,
    url: req.url,
    body: req,
  })
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

export default requestHandler
