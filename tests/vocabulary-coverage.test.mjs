import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {normalizeEntry,oxfordHeadwords,cetHeadwords,phraseHeadwords,makeVariantMap,matchForms,parsePos} from '../scripts/lib/vocabularyCoverage.mjs';
const read=async path=>JSON.parse(await readFile(new URL('../'+path,import.meta.url),'utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const dir='data/vocabulary-coverage-2026-10-29';
const report=await read(`${dir}/report.json`),sources=await read(`${dir}/reference-sources.json`),proposal=await read(`${dir}/first-batch-proposal.json`);

test('inventory normalization preserves real word/phrase and accent distinctions',()=>{
 assert.equal(normalizeEntry(' O’CLOCK '),"o'clock");assert.equal(normalizeEntry('Wi‑Fi'),'wi-fi');
 for(const[a,b]of [['work out','workout'],['every day','everyday'],['re-sign','resign'],['resume','résumé'],['minimize','minimization'],['according','according to']])assert.notEqual(normalizeEntry(a),normalizeEntry(b));
 assert.deepEqual(parsePos('modal v.'),['v']);assert.deepEqual(parsePos('indefinite article'),['det']);
});

test('Oxford-only annotations are removed without dropping literal digits or multiword entries',()=>{
 assert.deepEqual(oxfordHeadwords('Wi-Fi™'),['wi-fi']);
 assert.deepEqual(oxfordHeadwords('can1'),['can']);
 assert.deepEqual(oxfordHeadwords('bank (river)'),['bank']);
 assert.deepEqual(oxfordHeadwords('a, an'),['a','an']);
 assert.deepEqual(oxfordHeadwords('have to'),['have to']);
 assert.deepEqual(oxfordHeadwords('MP3'),['mp3']);
});

test('CET explicit optional letters and suffix variants retain their original group semantics',()=>{
 assert.deepEqual(cetHeadwords('analyze/-yse'),['analyze','analyse']);
 assert.deepEqual(cetHeadwords('alumin(i)um'),['aluminum','aluminium']);
 assert.deepEqual(cetHeadwords('special(i)ty'),['specialty','speciality']);
 assert.deepEqual(cetHeadwords('center/-tre'),['center','centre']);
 assert.deepEqual(cetHeadwords('a/an'),['a','an']);
 assert.deepEqual(cetHeadwords('accordingto'),['according to']);
 assert.deepEqual(cetHeadwords('oughtto'),['ought to']);
 assert.deepEqual(cetHeadwords('babyboom'),['baby boom']);
 assert.deepEqual(cetHeadwords('GDP'),['gdp']);
});

test('only registered spelling bridges match; an accent bridge is limited to its reviewed noun record',()=>{
 const none=new Map(),byWord=new Map([['work out',[1]],['everyday',[2]],['minimization',[3]],['resume',[9]],['minimize',[1098]]]);
 for(const form of ['workout','every day','minimise','résumé'])assert.equal(matchForms([form],byWord,none).status,'missing_standalone_entry');
 const map=makeVariantMap([{forms:['minimise','minimize'],allowedIds:[1098]},{forms:['résumé','resume'],allowedIds:[2043]}]);
 assert.equal(matchForms(['minimise'],byWord,map).status,'reviewed_spelling_variant');
 assert.equal(matchForms(['résumé'],byWord,map).status,'missing_standalone_entry','an unreviewed resume verb must not satisfy the CV noun');
 assert.deepEqual(matchForms(['résumé'],new Map([['resume',[2043]]]),map).ids,[2043]);
});

test('phrase end placeholders create only a surface stem; internal arguments and numeric frames stay explicit',()=>{
 assert.deepEqual(phraseHeadwords('look at sb/sth'),{forms:['look at'],shape:'simple_frame'});
 assert.deepEqual(phraseHeadwords('How are you?'),{forms:['how are you'],shape:'literal_phrase'});
 assert.equal(phraseHeadwords('get sb to do sth').shape,'complex_frame');
 assert.equal(phraseHeadwords('X years old').shape,'complex_frame');
 assert.equal(phraseHeadwords('differences between A and B').shape,'complex_frame');
 assert.equal(matchForms(['look at'],new Map([['look',[1]]]),new Map()).status,'missing_standalone_entry');
});

test('the frozen report partitions every comparison and keeps examination/source limitations visible',()=>{
 assert.equal(report.inputSha256,sources.canonicalInputSha256);
 for(const b of report.benchmarks){const c=b.counts;assert.equal(c.exact+c.reviewedVariants+c.missing,c.total);assert.equal(c.available,c.exact+c.reviewedVariants);if(c.categoryMatched!==null){assert(c.categoryMatched<=c.available);assert.equal(c.categoryMatched+c.availableOutsideCategory,c.available);}assert.equal(report.findings.filter(r=>r.benchmark===b.id).length,c.missing);}
 const sourceMap=new Map(report.referenceSources.map(s=>[s.id,s]));
 for(const row of report.findings)for(const ref of row.refs){assert(sourceMap.has(ref.sourceId));assert(ref.page>=1&&ref.page<=sourceMap.get(ref.sourceId).pages);}
 const cet=sourceMap.get('cet2016');assert.equal(cet.extraction.printedMainCount,5418);assert.equal(cet.extraction.physicalMainGroups,5377);assert.match(cet.extraction.countReconciliation,/not certified/i);
 for(const id of ['kaoyan','ielts','toefl'])assert(report.unverifiedExamTargets.some(t=>t.id===id&&t.status.includes('not_verified')));
 assert(report.limitations.some(text=>text.includes('not proof of structured teaching')));
});

test('the first batch is a proposal with no allocated IDs/audio, and historical reviews keep their original IDs',async()=>{
 assert.equal(proposal.newCandidates.length,50);assert.equal(new Set(proposal.newCandidates.map(c=>normalizeEntry(c.candidate))).size,50);
 assert.equal(proposal.newCandidates.filter(c=>c.kind==='phrase').length,30);assert.equal(proposal.newCandidates.filter(c=>c.kind==='lexeme').length,20);
 for(const c of proposal.newCandidates){assert.equal(c.id,null);assert.equal(c.example,null);assert.equal(c.audio,null);assert(c.sourceRefs.length>0);assert.equal(c.status,'reviewed_proposal_not_import_ready');}
 assert.equal(proposal.existingReviews.length,10);assert.equal(new Set(proposal.existingReviews.map(r=>r.id)).size,10);
 for(const r of proposal.existingReviews){assert.equal(r.current.id,r.id);assert.equal(r.current.word,r.word);}
 // Live absence is checked only while this historical baseline is still active.
 // Importing a future authorized batch should not invalidate a dated proposal.
 const bytes=await readFile(new URL('../public/data/vocabulary.json',import.meta.url));
 if(hash(bytes)===report.inputSha256){const keys=new Set(JSON.parse(bytes).map(w=>normalizeEntry(w.word)));for(const c of proposal.newCandidates)assert(!keys.has(normalizeEntry(c.candidate)));}
});

test('all five primary source receipts match the extraction metadata and cached PDFs when available',async()=>{
 assert.equal(sources.sources.length,5);
 for(const s of sources.sources){const actual=report.referenceSources.find(r=>r.id===s.id);assert(actual);assert.equal(actual.sha256,s.sha256);assert.equal(actual.parsedRows,s.expectedParsedRows);assert.equal(actual.pages,s.pages);
  let bytes;try{bytes=await readFile(new URL(`../output/vocabulary-coverage-2026-10-29/references/${s.id}.pdf`,import.meta.url));}catch(error){if(error.code==='ENOENT')continue;throw error;}
  assert.equal(bytes.length,s.bytes);assert.equal(hash(bytes),s.sha256);
 }
});
