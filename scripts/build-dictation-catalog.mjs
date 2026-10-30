import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { isDictationExample } from '../shared/dictation.js';

const source = new URL('../public/data/vocabulary.json', import.meta.url);
const destination = new URL('../worker/data/dictation-examples.json', import.meta.url);
// Retain registered versions so a later content release cannot invalidate an
// offline attempt. This is a server grading register, never a client answer pool.
const register = existsSync(destination) ? JSON.parse(readFileSync(destination, 'utf8')) : {};
for (const word of JSON.parse(readFileSync(source, 'utf8')).filter(isDictationExample)) {
  const versions = register[word.id] ||= [];
  if (!versions.some(item => item.word === word.word && item.example === word.example)) {
    versions.push({ word: word.word, example: word.example, exampleCn: word.exampleCn || '' });
  }
}
writeFileSync(destination, JSON.stringify(register));
console.log(`Dictation grading register: ${Object.keys(register).length} words`);
