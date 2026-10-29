// Audit-only matching. Never infer a stem or remove spaces/hyphens globally.
export const normalizeEntry=value=>String(value||'').normalize('NFKC').replace(/[’‘]/g,"'").replace(/[‐‑]/g,'-').replace(/\s+/g,' ').trim().toLowerCase();
export const oxfordHeadwords=label=>{
 const clean=String(label).replace(/[™®]/g,'').replace(/\s*\([^)]*\)/g,'').replace(/\b([a-z-]+)[12]\b/gi,'$1').trim();
 return (clean==='a, an'?['a','an']:[clean]).map(normalizeEntry);
};
const optional=value=>{
 const m=value.match(/\(([^()]*)\)/);if(!m)return[value];
 return [...optional(value.slice(0,m.index)+value.slice(m.index+m[0].length)),...optional(value.slice(0,m.index)+m[1]+value.slice(m.index+m[0].length))];
};
export const cetHeadwords=label=>{
 if(label==='accordingto')return['according to']; // p.16: tight PDF word spacing.
 if(label==='babyboom')return['baby boom']; // p.24: verified printed noun compound.
 if(label==='oughtto')return['ought to']; // p.96: modal construction, not one spelling.
 if(label==="coup(d'état)")return['coup',"coup d'état"];
 const [base,...alternatives]=label.split('/');const expanded=optional(base);
 for(const alternative of alternatives){
  if(alternative.startsWith('-'))for(const stem of optional(base))expanded.push(stem.slice(0,-alternative.slice(1).length)+alternative.slice(1));
  else expanded.push(...optional(alternative));
 }
 return [...new Set(expanded.map(normalizeEntry))];
};
export const phraseHeadwords=label=>{
 const pattern=/\b(?:sb|sth|X|A and B)\b|…|\.\.\.|\//.test(label);
 let stem=normalizeEntry(label).replace(/(?:…|\.\.\.)[?!]?$/,'').replace(/[?!]$/,'');
 // Only explicit end placeholders are omitted; no grammatical/semantic rewriting.
 stem=stem.replace(/\s+do sth$/,'').replace(/\s+(?:sb\/sth|sth\/sb|sb|sth)$/,'');
 const complex=/\b(?:sb|sth|x|a and b)\b|\/|\([^)]*\)/.test(stem);
 return{forms:[stem],shape:complex?'complex_frame':pattern?'simple_frame':'literal_phrase'};
};
export function makeVariantMap(reviews){
 const map=new Map();for(const review of reviews)for(const form of review.forms){const key=normalizeEntry(form);map.set(key,review.forms.filter(f=>normalizeEntry(f)!==key).map(form=>({key:normalizeEntry(form),allowedIds:review.allowedIds||null})));}return map;
}
export function matchForms(forms,byWord,variantMap){
 const exact=[...new Set(forms.flatMap(form=>byWord.get(normalizeEntry(form))||[]))];
 if(exact.length)return{status:'exact',ids:exact,matchedForms:forms.filter(form=>byWord.has(normalizeEntry(form)))};
 const variants=[...new Set(forms.flatMap(form=>(variantMap.get(normalizeEntry(form))||[]).flatMap(alt=>(byWord.get(alt.key)||[]).filter(id=>!alt.allowedIds||alt.allowedIds.includes(id)))))];
 return variants.length?{status:'reviewed_spelling_variant',ids:variants,matchedForms:forms.flatMap(form=>(variantMap.get(normalizeEntry(form))||[]).filter(alt=>byWord.has(alt.key)).map(alt=>alt.key))}:{status:'missing_standalone_entry',ids:[],matchedForms:[]};
}
export const parsePos=value=>[...new Set((String(value).match(/\b(?:noun|n|v|vt|vi|adj|a|adv|ad|aux|modal|prep|pron|det|art|article|conj|exclam|interj|int|num|number)\b/g)||[]).map(tag=>({noun:'n',a:'adj',ad:'adv',vt:'v',vi:'v',aux:'v',modal:'v',number:'num',exclam:'interj',int:'interj',art:'det',article:'det'}[tag]||tag)))];
