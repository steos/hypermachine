import { parse as parseUrl } from 'url'
import * as R from 'ramda'

const trimSlashes = s => s.replace(/^\/+/, '').replace(/\/+$/, '')

export const stringToPathSpec = s =>
  trimSlashes(s)
    .split('/')
    .map(segment => {
      if (segment.startsWith('{') && segment.endsWith('}')) {
        return {
          type: 'variable',
          value: segment.substring(1, segment.length - 1),
        }
      }
      return { type: 'literal', value: segment }
    })

export const matchSegment = (spec, segment) => {
  if (spec.type === 'variable') return [spec.value, segment]
  if (spec.type === 'literal') return spec.value === segment ? true : false
  throw new Error()
}

export const matchPathSpec = (spec, path) => {
  if (spec.length !== path.length) return null
  const matches = R.zip(spec, path).map(([spec, segment]) =>
    matchSegment(spec, segment)
  )
  if (matches.some(x => x === false)) return null
  return R.fromPairs(R.reject(x => x === true, matches))
}

const router = routes => {
  const matchers = R.toPairs(routes).map(([routePath, routeSpec]) => {
    const spec = stringToPathSpec(routePath)
    return path => {
      const match = matchPathSpec(spec, path)
      if (match == null) return null
      return typeof routeSpec === 'function' ? routeSpec(match) : routeSpec
    }
  })
  return url => {
    const { pathname } = parseUrl(url)
    const path = trimSlashes(pathname).split('/')
    for (const match of matchers) {
      const resource = match(path)
      if (resource != null) return resource
    }
    return null
  }
}

export default router
