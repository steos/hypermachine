import requestHandler from './request-handler'
import router, { RouteTable } from './router'

export { default as run, Resource, Context, ResourceConfig, resource } from './webmachine'
export { default as router, Router, RouteTable, RouteArgs } from './router'
export { default as requestHandler } from './request-handler'
export * as Http from './http'

export const dispatch = <T>(routes: RouteTable<T>) => requestHandler(router(routes))
