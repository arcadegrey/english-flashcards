// Read-only audit of active public word and hint examples; never rewrite personal history.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {getCoreWordHints} from '../src/utils/wordHints.js';
const root=new URL('../',import.meta.url),dir='data/vocabulary-neutral-examples';
const read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const rules=await read(`${dir}/screening-rules-2026-10-31.json`);
const topic=new RegExp(rules.pattern,'iu'),learning=new RegExp(rules.learningContextPattern,'iu');
const key=example=>JSON.stringify([example.en,example.zh]);
const exceptions=await read(`${dir}/neutral-exceptions-2026-10-31.json`);
const allowed=new Map(exceptions.map(example=>[key(example),example]));
const register=await read(`${dir}/reviews-2026-10-31.json`),words=await read('public/data/vocabulary.json');
const sourceSha256=createHash('sha256').update(JSON.stringify(words,null,2)+'\n').digest('hex');
assert.equal(sourceSha256,register.afterSha256,'Audit must match the reviewed content');
const result=[];
for(const word of words){
 const examples=[{type:'default',en:word.example,zh:word.exampleCn},...(word.examples||[]).map((example,index)=>({type:'sense',index,en:example.en,zh:example.zh})),
  ...getCoreWordHints(word).flatMap((hint,hintIndex)=>(hint.examples||[]).map((example,index)=>({type:'hint',hintIndex,index,en:example.en,zh:example.zh})))];
 for(const example of examples){
  let en=example.en,zh=example.zh;
  const quoted=[...en.matchAll(/'([a-z][a-z -]*)'/giu)].map(match=>match[1]);
  if(learning.test(en)&&quoted.length){for(const term of quoted){en=en.replaceAll(`'${term}'`,'');zh=zh.replaceAll(term,'');}}
  if(!topic.test(`${en} ${zh}`))continue;
  const exception=allowed.get(key(example));
  result.push({id:word.id,word:word.word,...example,status:exception?'reviewed-neutral':'unresolved',...(exception?{reason:exception.reason}:{})});
 }
}
const unresolved=result.filter(example=>example.status==='unresolved');
await mkdir(new URL('output/neutral-examples/',root),{recursive:true});
await writeFile(new URL('output/neutral-examples/topic-audit.json',root),JSON.stringify({sourceSha256,activeWords:words.length,screenedExamples:words.reduce((n,w)=>n+1+(w.examples?.length||0)+getCoreWordHints(w).reduce((m,h)=>m+(h.examples?.length||0),0),0),matches:result.length,unresolved:unresolved.length,examples:result},null,2)+'\n');
console.log(JSON.stringify({matches:result.length,unresolved:unresolved.length,examples:unresolved},null,2));
assert.equal(unresolved.length,0,'Review remaining political-topic candidates before release');
