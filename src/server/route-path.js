export async function resolveRoutePath(request, context) {
  const pathname = new URL(request.url).pathname
  const rawSegments = pathname.split('/').filter(Boolean)
  const fallbackPath = rawSegments[0] === 'api' ? rawSegments.slice(1) : rawSegments

  const routeParams = context?.params ? await context.params : {}
  const paramsPath = Array.isArray(routeParams.path) ? routeParams.path : []

  return paramsPath.length ? paramsPath : fallbackPath
}
