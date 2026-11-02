import http from 'node:http';
import { createClassroomFixture } from '../../tests/helpers/classroom-db.mjs';
import { startDeliveryServer } from './delivery-server.mjs';
import { hashEmailCode } from '../../worker/emailCodes.js';

// Loopback-only audit host: real Worker + disposable SQLite. Only outbound
// delivery to fictional email addresses is stubbed; no auth endpoint is mocked.
export async function startAccountAuditServer() {
  const fixture = await createClassroomFixture();
  const assets = await startDeliveryServer();
  const originalFetch = globalThis.fetch, messages = [];
  globalThis.fetch = async (url, options) => {
    if (String(url) !== 'https://api.resend.com/emails') throw new Error('External requests are disabled in account audits');
    const message = JSON.parse(options.body);
    if (!message.to.every(email => email.endsWith('@example.test'))) throw new Error('Only fictional audit email addresses are allowed');
    messages.push(message);
    return Response.json({ id: `audit-mail-${messages.length}` });
  };
  const server = http.createServer(async (req, res) => {
    try {
      if (!req.url.startsWith('/api/')) {
        const proxy = http.request(assets.url + req.url, { method: req.method, headers: req.headers }, response => {
          res.writeHead(response.statusCode, response.headers); response.pipe(res);
        });
        proxy.on('error', () => { res.writeHead(502); res.end(); });
        req.pipe(proxy); return;
      }
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const response = await fixture.worker.fetch(new Request(`http://127.0.0.1:${server.address().port}${req.url}`, {
        method: req.method, headers: req.headers,
        ...(!['GET', 'HEAD'].includes(req.method) ? { body: Buffer.concat(chunks) } : {}),
      }), fixture.env);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch { res.writeHead(500, { 'content-type': 'application/json' }); res.end('{"error":"Local audit failure"}'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`, fixture, messages,
    async seedCode(email, mode, code = '123456') {
      fixture.sqlite.prepare('INSERT INTO login_codes(email,mode,code_hash,expires_at,created_at) VALUES(?,?,?,?,?)')
        .run(email, mode, await hashEmailCode(email, mode, code, fixture.env.SESSION_SECRET), new Date(Date.now() + 600000).toISOString(), new Date().toISOString());
    },
    latestCode(email) { return messages.filter(m => m.to.includes(email)).at(-1)?.text.match(/\b\d{6}\b/)?.[0]; },
    async close() {
      await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
      await assets.close(); fixture.sqlite.close(); globalThis.fetch = originalFetch;
    },
  };
}
