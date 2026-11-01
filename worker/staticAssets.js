// Existing files remain asset-first. Only misses reach this fallback, so a
// navigation to a missing immutable URL must never cache index.html for a year.
export async function serveStaticAsset(request, assets) {
  const response = await assets.fetch(request)
  if (response.status !== 404) return response
  const url = new URL(request.url)
  const isResource = /^\/(?:api|assets|data|images|icons|audio|audio-updates)(?:\/|$)/.test(url.pathname)
    || url.pathname.split('/').pop().includes('.')
  const navigation = request.headers.get('sec-fetch-mode') === 'navigate'
    || request.headers.get('accept')?.includes('text/html')
  if (['GET', 'HEAD'].includes(request.method) && navigation && !isResource) {
    url.pathname = '/index.html'
    const shell = await assets.fetch(new Request(url, request))
    const headers = new Headers(shell.headers)
    headers.set('cache-control', 'public, max-age=0, must-revalidate')
    return new Response(shell.body, { status: shell.status, statusText: shell.statusText, headers })
  }
  const headers = new Headers(response.headers)
  headers.set('cache-control', 'no-store')
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}
