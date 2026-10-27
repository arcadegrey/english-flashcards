import imageAssets from '../data/imageAssets.json';

export const resolveImageAsset = src => imageAssets[src]?.src || src;
