import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('src/data/imageAssets.json', root), 'utf8'));

test('every shipped UI PNG has a smaller, decodable and content-addressed WebP preserving canvas proportions and alpha', async () => {
  const sources = (await readdir(new URL('public/images/ui-assets/', root)))
    .filter(name => name.endsWith('.png') && !/(?:-source|-alpha|sprite[^/]*)\.png$/.test(name));
  assert.equal(Object.keys(manifest).length, sources.length);
  let before = 0, after = 0;
  for (const name of sources) {
    const original = await readFile(new URL(`public/images/ui-assets/${name}`, root));
    const asset = manifest[`/images/ui-assets/${name}`];
    assert.ok(asset, name);
    const optimized = await readFile(new URL(`public${asset.src}`, root));
    const hash = createHash('sha256').update(optimized).digest('hex').slice(0, 16);
    assert.ok(asset.src.endsWith(`-${hash}.webp`), name);
    const sourceMetadata = await sharp(original).metadata();
    const metadata = await sharp(optimized).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.hasAlpha, sourceMetadata.hasAlpha, name);
    assert.ok(Math.abs(metadata.width / metadata.height - sourceMetadata.width / sourceMetadata.height) < 0.003, name);
    assert.ok(optimized.length < original.length, name);
    assert.equal(asset.bytes, optimized.length);
    assert.equal(asset.originalBytes, original.length);
    await sharp(optimized).raw().toBuffer();
    before += original.length; after += optimized.length;
  }
  assert.ok(after < before * 0.1, 'At least 90% less total image data');
});

test('the CSS landscape uses the same versioned WebP as the image manifest', async () => {
  const css = await readFile(new URL('src/styles/image-assets.css', root), 'utf8');
  assert.ok(css.includes(manifest['/images/ui-assets/mobile-learning-landscape-v1.png'].src));
});

test('home icon variants keep original canvas proportions and alpha, with distinct immutable delivery URLs', async () => {
  const small = Object.entries(manifest).filter(([, asset]) => asset.variants?.small);
  assert.equal(small.length, 8);
  let fullBytes = 0, smallBytes = 0;
  for (const [source, asset] of small) {
    const variant = asset.variants.small;
    const bytes = await readFile(new URL(`public${variant.src}`, root));
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
    const metadata = await sharp(bytes).metadata();
    const original = await sharp(await readFile(new URL(`public${source}`, root))).metadata();
    assert(variant.src.endsWith(`-small-${hash}.webp`));
    assert.notEqual(variant.src, asset.src);
    assert.equal(metadata.width, 192);
    assert.equal(metadata.height, variant.height);
    assert.equal(metadata.hasAlpha, original.hasAlpha);
    assert(Math.abs(metadata.width / metadata.height - original.width / original.height) < 0.004);
    assert.equal(bytes.length, variant.bytes);
    assert(bytes.length < asset.bytes);
    fullBytes += asset.bytes; smallBytes += variant.bytes;
    await sharp(bytes).raw().toBuffer();
  }
  assert(smallBytes < fullBytes * 0.3);
});
