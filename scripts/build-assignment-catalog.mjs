import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { getWordCategories } from '../src/utils/wordCategories.js';
const words = JSON.parse(readFileSync(new URL('../public/data/vocabulary.json', import.meta.url),'utf8'));
const catalog = words.map(word=>({id:word.id,word:word.word,meaning:word.meaning,categories:getWordCategories(word)}));
mkdirSync(new URL('../worker/data/',import.meta.url),{recursive:true});
writeFileSync(new URL('../worker/data/assignment-vocabulary.json',import.meta.url),JSON.stringify(catalog));
console.log(`Assignment catalog: ${catalog.length} words`);
