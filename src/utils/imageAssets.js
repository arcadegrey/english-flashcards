import imageAssets from '../data/imageAssets.json';

export const resolveImageAsset = (src, variant) => imageAssets[src]?.variants?.[variant]?.src || imageAssets[src]?.src || src;
