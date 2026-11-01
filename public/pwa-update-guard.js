// Imported by generateSW. Waiting is the default; only all-idle app pages may
// explicitly commit activation. Legacy/unresponsive pages conservatively block.
(() => {
  let checking = false
  const windows = () => self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const notify = (clients, type, token) => clients.forEach(client => {
    try { client.postMessage({ type, token }) } catch { /* A closed page needs no release. */ }
  })
  const ask = (client, type, token) => new Promise(resolve => {
    const channel = new MessageChannel()
    const finish = safe => { clearTimeout(timer); channel.port1.close(); resolve(safe) }
    const timer = setTimeout(() => finish(false), 2000)
    channel.port1.onmessage = event => {
      if (event.data?.token === token) finish(event.data.safe === true)
    }
    try { client.postMessage({ type, token }, [channel.port2]) } catch { finish(false) }
  })
  const samePages = (before, after) => before.length === after.length
    && after.every(client => before.some(previous => previous.id === client.id))
  self.addEventListener('message', event => {
    // Older Workbox clients may ask for immediate activation. Do not let the
    // generated default listener bypass the app's all-pages safety protocol.
    if (event.data?.type === 'SKIP_WAITING') { event.stopImmediatePropagation(); return }
    if (event.data?.type !== 'EF_REQUEST_UPDATE' || typeof event.data.token !== 'string' || !event.ports[0]) return
    const { token } = event.data, port = event.ports[0]
    if (checking) { port.postMessage({ token, ok: false, reason: 'busy' }); return }
    checking = true
    event.waitUntil((async () => {
      let clients = [], ok = false
      try {
        clients = await windows()
        if (!clients.some(client => client.id === event.source?.id)) throw new Error('unknown requester')
        const ready = await Promise.all(clients.map(client => ask(client, 'EF_UPDATE_PROBE', token)))
        if (ready.some(value => !value) || !samePages(clients, await windows())) throw new Error('busy')
        const confirmed = await Promise.all(clients.map(client => ask(client, 'EF_UPDATE_CONFIRM', token)))
        if (confirmed.some(value => !value) || !samePages(clients, await windows())) throw new Error('busy')
        const committed = await Promise.all(clients.map(client => ask(client, 'EF_UPDATE_COMMIT', token)))
        if (committed.some(value => !value) || !samePages(clients, await windows())) throw new Error('busy')
        await self.skipWaiting()
        ok = true
        port.postMessage({ token, ok: true })
      } catch {
        // Also release reservations if activation itself fails.
        notify(clients, 'EF_UPDATE_RELEASE', token)
        port.postMessage({ token, ok: false, reason: 'busy' })
      } finally { checking = false; if (!ok) port.close() }
    })())
  }, true)
})()
