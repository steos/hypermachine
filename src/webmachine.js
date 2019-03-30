import {reject, isNil, merge} from 'ramda'
import DecisionGraph from './decision-graph'
import resourceDefaults from './resource-defaults'

const InitialNode = 'service-available?'

const isAction = name => name.substr(-1) === '!'

const isDecision = name => name.substr(-1) === '?'

const isHandler = name => name.startsWith('handle-')

const isFunction = x => typeof x === 'function'

const isObject = x => Object.prototype.toString.call(x) === '[object Object]'

const isStr = x => Object.prototype.toString.call(x) === '[object String]'

const evaluate = (context, key, defaultValue = null) => {
  if (context.resource[key] == null) return defaultValue
  const value = context.resource[key]
  return isFunction(value) ? value(context) : value
}

const evaluateNode = (context, node) => {
  if (isDecision(node)) {
    const [pass, fail] = DecisionGraph[node]
    const result = evaluate(context, node)
    return result ? pass : fail
  } else if (isAction(node)) {
    evaluate(context, node)
    return DecisionGraph[node]
  } else {
    throw new Error('unknown node: ' + node)
  }
}

const dispatch = (context, init = InitialNode) => {
  let node = init
  while (!isHandler(node)) {
    node = evaluateNode(context, node)
  }
  return {handler: node, status: DecisionGraph[node], context}
}

const responseBuilder = (status, context, serialize) => result => {
  if (result == null) return {status, headers: {}}
  if (isObject(result)) return result
  const lastModified = evaluate(context, 'last-modified')
  const body = context.request.method !== 'HEAD'
    ? (isStr(result) ? result : serialize(result))
    : ''
  return {status, body, headers: reject(isNil, {
    'Content-Type': context.mediaType,
    'Last-Modified': lastModified ? httpDate(lastModified) : null,
    'ETag': evaluate(context, 'etag')
  })}
}

const defaultConfig = {
  serializers: {
    'application/json': x => JSON.stringify(x),
    'text/plain': x => x => x.toString(),
  }
}

const webmachine = (config = defaultConfig) => (resource, request) => {
  const {handler, status, context} = dispatch({
    resource: merge(resourceDefaults, resource),
    request
  })
  const serialize = config.serializers[context.mediaType]
  const toResponse = responseBuilder(status, context, serialize)
  return toResponse(evaluate(context, handler))
}

export default webmachine
