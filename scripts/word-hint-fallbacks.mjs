import { readFile } from 'node:fs/promises';

// Use the same reviewed, hashed batches through /assets when /data stalls.
// These modules stay on demand: they are not part of the eager graph or PWA install.
export function wordHintFallbacks(root = new URL('../', import.meta.url)) {
  let serving = false;
  const modules = new Map();
  return {
    name: 'word-hint-fallbacks',
    configResolved(config) { serving = config.command === 'serve'; },
    async buildStart() {
      const manifest = JSON.parse(await readFile(new URL('src/data/wordHintsManifest.json', root), 'utf8'));
      await Promise.all(Object.values(manifest.batches).map(async path => {
        const source = `export default ${await readFile(new URL(`public${path}`, root), 'utf8')};\n`;
        const fileName = path.replace('/data/word-hints/', 'assets/word-hints/').replace(/\.json$/, '.js');
        modules.set(`/${fileName}`, source);
        if (!serving) this.emitFile({ type: 'asset', fileName, source });
      }));
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const source = modules.get(request.url?.split('?')[0]);
        if (!source) return next();
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        response.end(source);
      });
    },
  };
}
