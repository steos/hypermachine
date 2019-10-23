export type RouteArgs = Record<string, string>

export type RouteValue<T> = T | Promise<T> | ((args: RouteArgs) => null | T | Promise<T>)

export interface VarSegment {
  kind: 'var'
  name: string
}

export interface LiteralSegment {
  kind: 'literal'
  value: string
}

export type RouteSegment = VarSegment | LiteralSegment

export type VarMatch = [string, string]

export type SegmentMatch = VarMatch | boolean

const matchSegment = (pathSegment: string, routeSegment: RouteSegment): SegmentMatch => {
  if (routeSegment.kind === 'literal') {
    return pathSegment === routeSegment.value
  } else if (routeSegment.kind === 'var') {
    return [routeSegment.name, pathSegment]
  }
  throw new Error()
}

const matchPath = (path: string[], route: RouteSegment[]): RouteArgs | null => {
  if (path.length !== route.length) return null
  const varEntries: VarMatch[] = []
  for (let i = 0; i < path.length; ++i) {
    const match = matchSegment(path[i], route[i])
    if (typeof match === 'boolean') {
      if (match === false) {
        return null
      }
    } else {
      varEntries.push(match)
    }
  }
  return Object.fromEntries(varEntries)
}

const readRouteSegment = (segment: string): RouteSegment => {
  if (segment.startsWith('{') && segment.endsWith('}')) {
    return { kind: 'var', name: segment.substring(1, segment.length - 1) }
  } else {
    return { kind: 'literal', value: segment }
  }
}

export type RouteMatch<T> = [T, RouteArgs]

export type RouteMatcher<T> = (path: string) => Promise<T | null>

const unwrap = async <T>(x: RouteValue<T>, args: RouteArgs): Promise<T | null> => {
  if (x instanceof Function) {
    return x(args)
  }
  return x
}

const buildRouteMatcher = <T>(route: string, value: RouteValue<T>): RouteMatcher<T> => {
  const routeSegments = route.split('/').map(readRouteSegment)
  return async (path: string): Promise<T | null> => {
    const match = matchPath(path.split('/'), routeSegments)
    if (match !== null) {
      return await unwrap(value, match)
    }
    return null
  }
}

export type RouteTable<T> = Record<string, RouteValue<T>>

const router = <T>(routes: RouteTable<T>) => {
  const matchers = Object.entries(routes).map(([route, value]) => buildRouteMatcher(route, value))
  return async (path: string): Promise<T | null> => {
    for (let matcher of matchers) {
      const match = await matcher(path)
      if (match !== null) return match
    }
    return null
  }
}

export default router
