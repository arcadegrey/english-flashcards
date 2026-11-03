import { STORAGE_KEYS } from './storage/keys.js';
import { createAccountStorage } from './storage/accountStorage.js';
import { createProgressStorage } from './storage/progressStorage.js';
import { createPlanStorage } from './storage/planStorage.js';
import { deviceStorage } from './storage/deviceStorage.js';

export const WORD_BOOKMARKS_STORAGE_KEY = STORAGE_KEYS.WORD_BOOKMARKS;

// Keep one public object: feature methods call the same facade without cyclic
// imports. Construction does not read or write storage before callers request it.
export const storage = {};
Object.assign(storage,
  createAccountStorage(storage),
  createProgressStorage(storage),
  createPlanStorage(storage),
  deviceStorage,
);
