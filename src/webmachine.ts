import { negotiateMediaType, NegotiatedMediaType } from './http-utils'

export enum Is {
  PostRedirect = 'post-redirect?',
  MovedTemporarily = 'moved-temporarily?',
  ValidEntityLength = 'valid-entity-length?',
  MediaTypeAvailable = 'media-type-available?',
  KnownMethod = 'known-method?',
  ModifiedSince = 'modified-since?',
  EtagMatchesForIfMatch = 'etag-matches-for-if-match?',
  IfMatchStar = 'if-match-star?',
  PostToExisting = 'post-to-existing?',
  IfModifiedSinceExists = 'if-modified-since-exists?',
  MethodPut = 'method-put?',
  CanPutToMissing = 'can-put-to-missing?',
  CanPostToGone = 'can-post-to-gone?',
  IsOptions = 'is-options?',
  PostToMissing = 'post-to-missing?',
  PutToDifferentUrl = 'put-to-different-url?',
  IfMatchExists = 'if-match-exists?',
  LanguageAvailable = 'language-available?',
  IfMatchStarExistsForMissing = 'if-match-star-exists-for-missing?',
  Processable = 'processable?',
  ValidContentHeader = 'valid-content-header?',
  IfNoneMatchStar = 'if-none-match-star?',
  Conflict = 'conflict?',
  PutToExisting = 'put-to-existing?',
  Allowed = 'allowed?',
  Existed = 'existed?',
  ServiceAvailable = 'service-available?',
  UnmodifiedSince = 'unmodified-since?',
  DeleteEnacted = 'delete-enacted?',
  AcceptLanguageExists = 'accept-language-exists?',
  IfNoneMatchExists = 'if-none-match-exists?',
  CharsetAvailable = 'charset-available?',
  MethodPatch = 'method-patch?',
  AcceptEncodingExists = 'accept-encoding-exists?',
  Exists = 'exists?',
  MethodDelete = 'method-delete?',
  CanPostToMissing = 'can-post-to-missing?',
  KnownContentType = 'known-content-type?',
  MovedPermanently = 'moved-permanently?',
  IfModifiedSinceValidDate = 'if-modified-since-valid-date?',
  Malformed = 'malformed?',
  IfUnmodifiedSinceValidDate = 'if-unmodified-since-valid-date?',
  MultipleRepresentations = 'multiple-representations?',
  EtagMatchesForIfNone = 'etag-matches-for-if-none?',
  RespondWithEntity = 'respond-with-entity?',
  MethodAllowed = 'method-allowed?',
  UriTooLong = 'uri-too-long?',
  IfUnmodifiedSinceExists = 'if-unmodified-since-exists?',
  PostToGone = 'post-to-gone?',
  AcceptCharSetExists = 'accept-charset-exists?',
  EncodingAvailable = 'encoding-available?',
  Authorized = 'authorized?',
  AcceptExists = 'accept-exists?',
  IfNoneMatch = 'if-none-match?',
  New = 'new?',
}

export enum Handle {
  Ok = 'handle-ok',
  NotFound = 'handle-not-found',
  UriTooLong = 'handle-uri-too-long',
  RequestEntityTooLarge = 'handle-request-entity-too-large',
  Gone = 'handle-gone',
  Accepted = 'handle-accepted',
  PreconditionFailed = 'handle-precondition-failed',
  Created = 'handle-created',
  Forbidden = 'handle-forbidden',
  Options = 'handle-options',
  Unauthorized = 'handle-unauthorized',
  UnprocessableEntity = 'handle-unprocessable-entity',
  NotAcceptable = 'handle-not-acceptable',
  UnsupportedMediaType = 'handle-unsupported-media-type',
  NotImplemented = 'handle-not-implemented',
  UnknownMethod = 'handle-unknown-method',
  MultipleRepresentations = 'handle-multiple-representations',
  MovedTemporarily = 'handle-moved-temporarily',
  NotModified = 'handle-not-modified',
  SeeOther = 'handle-see-other',
  MovedPermanently = 'handle-moved-permantently',
  NoContent = 'handle-no-content',
  Malformed = 'handle-malformed',
  Exception = 'handle-exception',
  Conflict = 'handle-conflict',
  MethodNotAllowed = 'handle-method-not-allowed',
  ServiceNotAvailable = 'handle-service-not-available',
}

export enum Action {
  Put = 'put!',
  Post = 'post!',
  Delete = 'delete!',
  Patch = 'patch!',
}

interface DecisionNode {
  kind: 'decision'
  name: Is
  whenTrue: TreeNode
  whenFalse: TreeNode
}

interface HandlerNode {
  kind: 'handler'
  name: Handle
  status: number
}

interface ActionNode {
  kind: 'action'
  name: Action
  next: TreeNode
}

type TreeNode = DecisionNode | HandlerNode | ActionNode

const handler = (name: Handle, status: number): HandlerNode => ({
  kind: 'handler',
  name,
  status,
})
const action = (name: Action, next: TreeNode): ActionNode => ({
  kind: 'action',
  name,
  next,
})
const decision = (name: Is, whenTrue: TreeNode, whenFalse: TreeNode): DecisionNode => ({
  kind: 'decision',
  name,
  whenTrue,
  whenFalse,
})

const handleAccepted = handler(Handle.Accepted, 202)
const handleConflict = handler(Handle.Conflict, 409)
const handleCreated = handler(Handle.Created, 201)
const handleException = handler(Handle.Exception, 500)
const handleForbidden = handler(Handle.Forbidden, 403)
const handleGone = handler(Handle.Gone, 410)
const handleMalformed = handler(Handle.Malformed, 400)
const handleMethodNotAllowed = handler(Handle.MethodNotAllowed, 405)
const handleMovedPermanently = handler(Handle.MovedPermanently, 301)
const handleMovedTemporarily = handler(Handle.MovedTemporarily, 307)
const handleMultipleRepresentations = handler(Handle.MultipleRepresentations, 300)
const handleNoContent = handler(Handle.NoContent, 204)
const handleNotAcceptable = handler(Handle.NotAcceptable, 406)
const handleNotFound = handler(Handle.NotFound, 404)
const handleNotImplemented = handler(Handle.NotImplemented, 501)
const handleNotModified = handler(Handle.NotModified, 304)
const handleOk = handler(Handle.Ok, 200)
const handleOptions = handler(Handle.Options, 200)
const handlePreconditionFailed = handler(Handle.PreconditionFailed, 412)
const handleRequestEntityTooLarge = handler(Handle.RequestEntityTooLarge, 413)
const handleSeeOther = handler(Handle.SeeOther, 303)
const handleServiceNotAvailable = handler(Handle.ServiceNotAvailable, 503)
const handleUnauthorized = handler(Handle.Unauthorized, 401)
const handleUnknownMethod = handler(Handle.UnknownMethod, 501)
const handleUnprocessableEntity = handler(Handle.UnprocessableEntity, 422)
const handleUnsupportedMediaType = handler(Handle.UnsupportedMediaType, 415)
const handleUriTooLong = handler(Handle.UriTooLong, 414)

const whenMultipleRepresentations = decision(
  Is.MultipleRepresentations,
  handleMultipleRepresentations,
  handleOk
)
const whenRespondWithEntity = decision(
  Is.RespondWithEntity,
  whenMultipleRepresentations,
  handleNoContent
)
const whenNew = decision(Is.New, handleCreated, whenRespondWithEntity)
const whenPostRedirect = decision(Is.PostRedirect, handleSeeOther, whenNew)
const doPost = action(Action.Post, whenPostRedirect)
const whenCanPostToGone = decision(Is.PostToGone, doPost, handleGone)
const whenPostToGone = decision(Is.PostToGone, whenCanPostToGone, handleGone)
const whenMovedTemporarily = decision(Is.MovedTemporarily, handleMovedTemporarily, whenPostToGone)
const whenMovedPermanently = decision(
  Is.MovedPermanently,
  handleMovedPermanently,
  whenMovedTemporarily
)
const whenCanPostToMissing = decision(Is.CanPostToMissing, doPost, handleNotFound)
const whenPostToMissing = decision(Is.PostToMissing, whenCanPostToMissing, handleNotFound)
const whenExisted = decision(Is.Existed, whenMovedPermanently, whenPostToMissing)
const doPut = action(Action.Put, whenNew)
const whenConflict = decision(Is.Conflict, handleConflict, doPut)
const whenCanPutToMissing = decision(Is.CanPutToMissing, whenConflict, handleNotImplemented)
const whenPutToDifferentUrl = decision(
  Is.PutToDifferentUrl,
  handleMovedPermanently,
  whenCanPutToMissing
)
const whenMethodPut = decision(Is.MethodPut, whenPutToDifferentUrl, whenExisted)
const whenIfNoneMatch = decision(Is.IfNoneMatchStar, handleNotModified, handlePreconditionFailed)
const whenDeleteEnacted = decision(Is.DeleteEnacted, whenRespondWithEntity, handleAccepted)
const doDelete = action(Action.Delete, whenDeleteEnacted)
const doPatch = action(Action.Patch, whenRespondWithEntity)
const whenPutToExisting = decision(Is.PutToExisting, whenConflict, whenMultipleRepresentations)
const whenPostToExisting = decision(Is.PostToExisting, doPost, whenPutToExisting)
const whenMethodPatch = decision(Is.MethodPatch, doPatch, whenPostToExisting)
const whenMethodDelete = decision(Is.MethodDelete, doDelete, whenMethodPatch)
const whenModifiedSince = decision(Is.ModifiedSince, whenMethodDelete, handleNotModified)
const whenIfModifiedSinceValidDate = decision(
  Is.IfModifiedSinceValidDate,
  whenModifiedSince,
  whenMethodDelete
)
const whenIfModifiedSinceExists = decision(
  Is.IfModifiedSinceExists,
  whenIfModifiedSinceValidDate,
  whenMethodDelete
)
const whenEtagMatchesForIfNone = decision(
  Is.EtagMatchesForIfNone,
  whenIfNoneMatch,
  whenIfModifiedSinceExists
)
const whenIfNoneMatchStar = decision(Is.IfNoneMatchStar, whenIfNoneMatch, whenEtagMatchesForIfNone)
const whenIfNoneMatchExists = decision(
  Is.IfNoneMatchExists,
  whenIfNoneMatchStar,
  whenIfModifiedSinceExists
)
const whenUnmodifiedSince = decision(
  Is.UnmodifiedSince,
  handlePreconditionFailed,
  whenIfNoneMatchExists
)
const whenIfUnmodifiedSinceValidDate = decision(
  Is.IfUnmodifiedSinceValidDate,
  whenUnmodifiedSince,
  whenIfNoneMatchExists
)
const whenIfUnmodifiedSinceExists = decision(
  Is.IfUnmodifiedSinceExists,
  whenIfUnmodifiedSinceValidDate,
  whenIfNoneMatchExists
)
const whenEtagMatchesForIfMatch = decision(
  Is.EtagMatchesForIfMatch,
  whenIfUnmodifiedSinceExists,
  handlePreconditionFailed
)
const whenIfMatchStar = decision(
  Is.IfMatchStar,
  whenIfUnmodifiedSinceExists,
  whenEtagMatchesForIfMatch
)
const whenIfMatchExists = decision(Is.IfMatchExists, whenIfMatchStar, whenIfUnmodifiedSinceExists)
const whenIfMatchStarExistsForMissing = decision(
  Is.IfMatchStarExistsForMissing,
  handlePreconditionFailed,
  whenMethodPut
)
const whenExists = decision(Is.Exists, whenIfMatchExists, whenIfMatchStarExistsForMissing)
const whenProcessable = decision(Is.Processable, whenExists, handleUnprocessableEntity)
const whenEncodingAvailable = decision(Is.EncodingAvailable, whenProcessable, handleNotAcceptable)
const whenAcceptEncodingExists = decision(
  Is.AcceptEncodingExists,
  whenEncodingAvailable,
  whenProcessable
)
const whenCharsetAvailable = decision(
  Is.CharsetAvailable,
  whenAcceptEncodingExists,
  handleNotAcceptable
)
const whenAcceptCharsetExists = decision(
  Is.AcceptCharSetExists,
  whenCharsetAvailable,
  whenAcceptEncodingExists
)
const whenLanguageAvailable = decision(
  Is.LanguageAvailable,
  whenAcceptCharsetExists,
  handleNotAcceptable
)
const whenAcceptLanguageExists = decision(
  Is.AcceptLanguageExists,
  whenLanguageAvailable,
  whenAcceptCharsetExists
)
const whenMediaTypeAvailable = decision(
  Is.MediaTypeAvailable,
  whenAcceptLanguageExists,
  handleNotAcceptable
)
const whenAcceptExists = decision(Is.AcceptExists, whenMediaTypeAvailable, whenAcceptLanguageExists)
const whenIsOptions = decision(Is.IsOptions, handleOptions, whenAcceptExists)
const whenValidEntityLength = decision(
  Is.ValidEntityLength,
  whenIsOptions,
  handleRequestEntityTooLarge
)

const whenKnownContentType = decision(
  Is.KnownContentType,
  whenValidEntityLength,
  handleUnsupportedMediaType
)
const whenValidContentHeader = decision(
  Is.ValidContentHeader,
  whenKnownContentType,
  handleNotImplemented
)
const whenAllowed = decision(Is.Allowed, whenValidContentHeader, handleForbidden)
const whenAuthorized = decision(Is.Authorized, whenAllowed, handleUnauthorized)
const whenMalformed = decision(Is.Malformed, handleMalformed, whenAuthorized)
const whenMethodAllowed = decision(Is.MethodAllowed, whenMalformed, handleMethodNotAllowed)
const whenUriTooLong = decision(Is.UriTooLong, handleUriTooLong, whenMethodAllowed)
const whenKnownMethod = decision(Is.KnownMethod, whenUriTooLong, handleUnknownMethod)
const whenServiceAvailable = decision(
  Is.ServiceAvailable,
  whenKnownMethod,
  handleServiceNotAvailable
)

export type Lazy<T> = T | Promise<T> | ((context: Context) => T | Promise<T>)

export type ActionFn = (context: Context) => Promise<void> | void

type MediaTypes<T> = Record<string, Serializer<T>>

export interface Directives<T> {
  readonly 'allowed-methods': string[]
  readonly 'available-media-types': MediaTypes<T>
  readonly 'available-languages': string[]
  readonly 'available-charsets': string[]
  readonly 'available-encodings': string[]
}

export type ResourceConfig<T> = {
  readonly [S in Handle | Action | Is]?: (S extends Handle
    ? Lazy<T>
    : S extends Action
    ? ActionFn
    : Lazy<boolean>)
} &
  Directives<T>

export type Resource<T> = Partial<ResourceConfig<T>>

export interface HttpRequest {
  readonly headers: HttpHeaders
  readonly url: string
  readonly body: HttpBody
  readonly method: string
}

export type Context = {
  negotiatedMediaType?: NegotiatedMediaType
  etag?: string
  readonly request: HttpRequest
  readonly availableMediaTypes: string[]
  readonly allowedMethods: string[]
  readonly availableLanguages: string[]
  readonly availableCharsets: string[]
  readonly availableEncodings: string[]
}

export type HttpBody = string | AsyncIterable<any>

export type Serializer<T> = (x: T, context: Context) => HttpBody

export type HttpHeaders = Record<string, string | string[] | undefined>

export interface HttpResponse {
  readonly body?: HttpBody
  readonly status: number
  readonly headers: HttpHeaders
}

const methodEquals = (method: string) => (context: Context): boolean =>
  context.request.method === method

const hasHeader = (header: string) => (context: Context) => context.request.headers[header] != null

const headerEquals = (header: string, value: string) => (context: Context) =>
  context.request.headers[header] === value

const matchEtag = (header: string) => (context: Context) =>
  context.etag === context.request.headers[header]

const defaultResourceConfig: ResourceConfig<any> = {
  'allowed-methods': ['GET', 'HEAD'],
  'available-media-types': { 'application/json': (x: any) => JSON.stringify(x) },
  'available-languages': ['*'],
  'available-charsets': ['UTF-8'],
  'available-encodings': ['identity'],
  'new?': true,
  'service-available?': true,
  'authorized?': true,
  'allowed?': true,
  'valid-content-header?': true,
  'valid-entity-length?': true,
  'processable?': true,
  'exists?': true,
  'can-post-to-missing?': true,
  'can-put-to-missing?': true,
  'delete-enacted?': true,
  'known-content-type?': true,

  'is-options?': methodEquals('OPTIONS'),
  'method-put?': methodEquals('PUT'),
  'method-delete?': methodEquals('DELETE'),
  'method-patch?': methodEquals('PATCH'),

  'post-to-existing?': methodEquals('POST'),
  'put-to-existing?': methodEquals('PUT'),
  'post-to-gone?': methodEquals('POST'),

  'if-match-star-exists-for-missing?': headerEquals('if-match', '*'),
  'if-match-star?': headerEquals('if-match', '*'),
  'if-none-match-star?': headerEquals('if-none-match', '*'),

  'etag-matches-for-if-none?': matchEtag('if-none-match'),
  'etag-matches-for-if-match?': matchEtag('if-match'),

  'if-unmodified-since-exists?': hasHeader('if-unmodified-since'),
  'if-modified-since-exists?': hasHeader('if-modified-since'),
  'if-match-exists?': hasHeader('if-match'),
  'if-none-match-exists?': hasHeader('if-none-match'),

  'if-none-match?': context =>
    context.request.method ? ['GET', 'HEAD'].includes(context.request.method) : false,

  'if-unmodified-since-valid-date?': context => true, //TODO

  'modified-since?': context => {
    //TODO
    return false
  },

  'unmodified-since?': context => {
    //TODO
    return false
  },

  'known-method?': context =>
    context.request.method
      ? ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE', 'PATCH'].includes(
          context.request.method
        )
      : false,

  'method-allowed?': context =>
    context.request.method ? context.allowedMethods.includes(context.request.method) : false,

  'accept-exists?': context => {
    const { accept } = context.request.headers
    if (accept != null && accept !== '*/*') {
      return true
    }

    return false
  },

  'media-type-available?': context => {
    const { accept } = context.request.headers
    if (typeof accept === 'string') {
      const negotiatedMediaType = negotiateMediaType(accept, context.availableMediaTypes)
      if (negotiatedMediaType !== null) {
        context.negotiatedMediaType = negotiatedMediaType
        return true
      }
    }
    return false
  },
}

interface TraceNode {
  node: TreeNode
  value?: string
}

const traceHeaderName = 'X-Webmachine-Trace'

const unwrap = async <T>(val: Lazy<T>, context: Context): Promise<T> => {
  if (val instanceof Function) {
    return val(context)
  }
  return val
}

const resolve = async <T>(
  node: TreeNode,
  resource: ResourceConfig<T>,
  context: Context,
  trace: TraceNode[]
): Promise<HandlerNode> => {
  if (node.kind === 'handler') {
    trace.push({ node })
    return node
  } else if (node.kind === 'action') {
    trace.push({ node })
    await unwrap(resource[node.name], context)
    return resolve(node.next, resource, context, trace)
  } else if (node.kind === 'decision') {
    const val = resource[node.name]
    const x: boolean | null = val !== undefined ? await unwrap(val, context) : null
    trace.push({ node, value: JSON.stringify(x) })
    const next: TreeNode = x ? node.whenTrue : node.whenFalse
    return resolve(next, resource, context, trace)
  }
  throw new Error()
}

const printTraceNode = ({ node, value }: TraceNode): string =>
  [node.name, value].filter(x => x !== undefined).join(' ')

const headers = (request: HttpRequest, context: Context, trace: TraceNode[]): HttpHeaders => {
  const enableTrace = request.headers[traceHeaderName.toLowerCase()] === 'enable'
  const headers: HttpHeaders = {}
  if (enableTrace) {
    headers[traceHeaderName] = trace.map(printTraceNode)
  }
  return headers
}

const webmachine = async <T>(
  resource: Resource<T>,
  request: HttpRequest
): Promise<HttpResponse> => {
  const res: ResourceConfig<T> = { ...defaultResourceConfig, ...resource }
  const context: Context = {
    request,
    allowedMethods: res['allowed-methods'],
    availableMediaTypes: Object.keys(res['available-media-types']),
    availableLanguages: res['available-languages'],
    availableCharsets: res['available-charsets'],
    availableEncodings: res['available-encodings'],
  }

  const trace: TraceNode[] = []
  const node: HandlerNode = await resolve(whenServiceAvailable, res, context, trace)
  const handler = resource[node.name]
  const result = handler ? await unwrap(handler, context) : null

  let body = undefined
  if (result !== null) {
    const negotiatedMediaType = context.negotiatedMediaType
    const type = negotiatedMediaType ? negotiatedMediaType.type : context.availableMediaTypes[0]
    const serializer: Serializer<T> = res['available-media-types'][type]
    body = serializer(result, context)
  }
  return { body, status: node.status, headers: headers(request, context, trace) }
}

export const readHttpBody = async (body: HttpBody, encoding: string = 'utf8'): Promise<string> => {
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

export default webmachine
