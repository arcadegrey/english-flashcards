import {beforeCommonSensesReview} from '../shared/vocabularyHistory.js';
// Read-only database coverage audit. Writes reports/candidates only, never app data.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {RETIRED_VOCABULARY} from '../shared/retiredVocabulary.js';
import {getCoreWordHints} from '../src/utils/wordHints.js';
import {normalizeEntry,oxfordHeadwords,cetHeadwords,phraseHeadwords,makeVariantMap,matchForms,parsePos} from './lib/vocabularyCoverage.mjs';
const root=new URL('../',import.meta.url),dataDir='data/vocabulary-coverage-2026-10-29';
const read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const serialize=value=>JSON.stringify(value,null,2)+'\n';
const ranks={A1:1,A2:2,B1:3,B2:4,C1:5,C2:6};
export async function runCoverageAudit({referencePath='output/vocabulary-coverage-2026-10-29/reference-rows.json'}={}){
 const raw=await readFile(new URL('public/data/vocabulary.json',root),'utf8'),currentWords=JSON.parse(raw),words=beforeCommonSensesReview(currentWords),sourceHash=hash(serialize(words));
 const repair=await read('data/vocabulary-common-senses-repair/reviews-2026-10-29.json');
 const expansion=await read('data/vocabulary-expansion-50/register-2026-10-29.json');
 assert([repair.baselineSha256,repair.afterSha256,expansion.afterSha256].includes(hash(raw)),'Unregistered vocabulary edits; do not overwrite the historical audit.');
 const references=await read(referencePath),normalization=await read(`${dataDir}/normalization-reviews.json`);
 const sourceRegistry=await read(`${dataDir}/reference-sources.json`);
 const formatting=await read(`${dataDir}/source-format-reviews.json`);
 for(const source of references.sources){const expected=sourceRegistry.sources.find(s=>s.id===source.id);assert(expected&&expected.sha256===source.sha256&&expected.expectedParsedRows===source.rows.length,`Unregistered source ${source.id}`);}
 const byId=new Map(words.map(w=>[w.id,w])),byWord=new Map(),retiredByWord=new Map();
 for(const w of words){const key=normalizeEntry(w.word);byWord.set(key,[...(byWord.get(key)||[]),w.id]);}
 for(const w of RETIRED_VOCABULARY){const key=normalizeEntry(w.word);retiredByWord.set(key,[...(retiredByWord.get(key)||[]),w.id]);}
 assert.equal(words.length,8699);assert.equal(sourceHash,'fda962f32cb674b1610af43715d4147616570a7c0c3defd654d1a1a3f9e445a6','Review a new baseline before overwriting this audit snapshot.');
 const looseKey=value=>normalizeEntry(value).normalize('NFD').replace(/\p{M}/gu,'').replace(/[ -]/g,'');
 const nearByWord=new Map();for(const word of words){const key=looseKey(word.word);nearByWord.set(key,[...(nearByWord.get(key)||[]),{id:word.id,word:word.word}]);}
 const morphology=await read(`${dataDir}/morphology-reviews.json`);
 for(const review of morphology)assert(byWord.has(normalizeEntry(review.parent)),`Missing related parent: ${review.parent}`);
 const variants=makeVariantMap(normalization),sources=new Map(references.sources.map(s=>[s.id,s]));
 function units(rows,sourceId){return rows.map(row=>{
  const shape=sourceId==='oxford-phrases'?phraseHeadwords(row.label):null;
  const forms=sourceId==='cet2016'?cetHeadwords(row.label):sourceId.startsWith('oxford')&&!shape?oxfordHeadwords(row.label):shape?.forms||[normalizeEntry(row.label)];
  return{key:forms.slice().sort().join('|'),candidate:forms[0],forms,shape:shape?.shape||(forms.some(form=>form.includes(' '))?'multiword_from_wordlist':'word'),refs:[{sourceId,...row}]};
 });}
 function merge(entries){const map=new Map();for(const entry of entries){const prior=map.get(entry.key);if(prior)prior.refs.push(...entry.refs);else map.set(entry.key,{...entry,refs:[...entry.refs]});}return[...map.values()];}
 const ox3=units(sources.get('oxford3000').rows,'oxford3000'),ox5=units(sources.get('oxford5000-additional').rows,'oxford5000-additional');
 const cet=units(sources.get('cet2016').rows,'cet2016'),awl=units(sources.get('awl-headwords').rows,'awl-headwords'),phrases=units(sources.get('oxford-phrases').rows,'oxford-phrases');
 const views=[
  ['oxford3000','Oxford 3000：去重词头',ox3,null],
  ['oxford5000-additional','Oxford 5000：额外词头',ox5,null],
  ['oxford5000-union','Oxford 3000 + 额外词表合并', [...ox3,...ox5],null],
  ['cet2016-base','CET 2016：未标星印刷词目组',cet.filter(e=>!e.refs[0].starred),'cet4'],
  ['cet2016-six-increment','CET 2016：标星增量印刷词目组',cet.filter(e=>e.refs[0].starred),'cet6'],
  ['cet2016-all','CET 2016：全部印刷词目组',cet,null],
  ['awl-headwords','AWL：570个词族代表词',awl,null],
  ['oxford-phrases','Oxford Phrase List：主要短语／结构表头',phrases,null],
 ];
 const textPieces=words.flatMap(word=>[word.example,...getCoreWordHints(word).flatMap(hint=>[hint.text,...(hint.examples||[]).map(e=>e.en)])].filter(Boolean));
 const corpus=textPieces.map(normalizeEntry).join('\u0000');
 const regexEscape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const phraseMention=phrase=>phrase.length>=5&&!/\b(?:sb|sth|x)\b/.test(phrase)&&new RegExp(`(?<![\\p{L}\\p{N}_-])${regexEscape(phrase)}(?![\\p{L}\\p{N}_-])`,'u').test(corpus);
 const benchmarks=[],findings=[],posCues=[],categoryGaps=[];
 for(const[id,title,entries,category]of views){
  const unique=merge(entries),rows=unique.map(unit=>{
   const match=matchForms(unit.forms,byWord,variants),levels=[...new Set(unit.refs.map(r=>r.level).filter(Boolean))].sort((a,b)=>ranks[a]-ranks[b]);
   const sublists=unit.refs.map(r=>r.sublist).filter(Boolean);
   const retired=matchForms(unit.forms,retiredByWord,variants);
   const categoryMatch=category?match.ids.filter(id=>(byId.get(id).categories||[byId.get(id).category]).includes(category)):[];
   const near=match.ids.length?[]:[...new Map(unit.forms.flatMap(form=>nearByWord.get(looseKey(form))||[]).map(item=>[item.id,item])).values()];
   const family=morphology.find(item=>unit.forms.includes(item.form));
   const related=unit.refs.filter(r=>r.sourceId==='cet2016').flatMap(r=>r.derived).flatMap(cetHeadwords).filter(form=>byWord.has(form));
   return{...unit,benchmark:id,...match,level:levels[0]||null,levels,sublist:sublists.length?Math.min(...sublists):null,
    category,categoryMatchedIds:categoryMatch,nearSpellingCandidates:near,morphologyReview:family||null,sourceFormatReview:formatting.find(item=>unit.refs.some(ref=>ref.sourceId===item.sourceId&&ref.label===item.rawLabel))||null,retiredIds:match.ids.length?[]:retired.ids,relatedDerivedForms:[...new Set(related)],
    literalMentionInApp:id==='oxford-phrases'&&!match.ids.length?phraseMention(unit.candidate):null};
  });
  const counts={total:rows.length,exact:rows.filter(r=>r.status==='exact').length,reviewedVariants:rows.filter(r=>r.status==='reviewed_spelling_variant').length,
   missing:rows.filter(r=>!r.ids.length).length,retiredOnly:rows.filter(r=>!r.ids.length&&r.retiredIds.length).length,
   categoryMatched:category?rows.filter(r=>r.categoryMatchedIds.length).length:null,
   availableOutsideCategory:category?rows.filter(r=>r.ids.length&&!r.categoryMatchedIds.length).length:null};
  counts.available=counts.exact+counts.reviewedVariants;counts.inventoryMatchPercent=Number((counts.available/counts.total*100).toFixed(2));
  const byLevel={};for(const row of rows){const key=row.level||'ungraded';const c=byLevel[key]||{total:0,available:0,missing:0};c.total++;row.ids.length?c.available++:c.missing++;byLevel[key]=c;}
  benchmarks.push({id,title,unit:id.startsWith('cet')?'deduplicated extracted printed alternative group; NOT nominal official 5418-count coverage':id==='oxford-phrases'?'deduplicated heading/stem; counts standalone-card presence, not teaching coverage':'deduplicated normalized headword; NOT word-family or sense mastery',category,counts,byLevel,
   ...(id==='oxford-phrases'?{shapes:Object.fromEntries(['literal_phrase','simple_frame','complex_frame'].map(shape=>[shape,rows.filter(r=>r.shape===shape).length])),missingButMentioned:rows.filter(r=>!r.ids.length&&r.literalMentionInApp).length}:{}),
   variants:rows.filter(r=>r.status==='reviewed_spelling_variant').map(r=>({candidate:r.candidate,matchedForms:r.matchedForms,ids:r.ids}))});
  findings.push(...rows.filter(r=>!r.ids.length));
  if(category)categoryGaps.push(...rows.filter(r=>r.ids.length&&!r.categoryMatchedIds.length).map(r=>({benchmark:id,candidate:r.candidate,forms:r.forms,ids:r.ids,refs:r.refs.map(({sourceId,page,label})=>({sourceId,page,label}))})));
  if(id==='oxford5000-union')for(const row of rows.filter(r=>r.ids.length)){
   const expected=[...new Set(row.refs.flatMap(r=>parsePos(r.pos)))],actual=[...new Set(row.ids.flatMap(id=>parsePos(byId.get(id).pos)))];
   const missingTags=expected.filter(tag=>!actual.includes(tag));
   if(missingTags.length)posCues.push({candidate:row.candidate,ids:row.ids,level:row.level,missingTags,actualTags:actual,sourceRefs:row.refs,
    current:row.ids.map(id=>({id,word:byId.get(id).word,pos:byId.get(id).pos,meaning:byId.get(id).meaning,hintScopes:getCoreWordHints(byId.get(id)).map(h=>h.scope)})),status:'screening_cue_not_independent_error_verdict'});
  }
 }
 const proposal=await read(`${dataDir}/first-batch-proposal.json`);
 assert.equal(proposal.newCandidates.length,50);assert.equal(proposal.existingReviews.length,10);
 for(const candidate of proposal.newCandidates){assert(!byWord.has(normalizeEntry(candidate.candidate)),`Proposed duplicate: ${candidate.candidate}`);assert(!retiredByWord.has(normalizeEntry(candidate.candidate)),`Proposed retired spelling: ${candidate.candidate}`);assert(findings.some(f=>f.candidate===candidate.candidate||(candidate.candidate==='maximize'&&f.candidate==='maximise')),`No source: ${candidate.candidate}`);}
 for(const review of proposal.existingReviews)assert.deepEqual(review.current,byId.get(review.id),`Stale existing-ID review ${review.id}`);
 const report={auditDate:'2026-10-29',input:'public/data/vocabulary.json',inputSha256:sourceHash,
  library:{multiwordStoredRecords:words.filter(w=>/\s/.test(w.word)).length,hyphenatedStoredRecords:words.filter(w=>w.word.includes('-')).length,activeRecords:words.length,uniqueNormalizedHeadwords:byWord.size,retiredRecords:RETIRED_VOCABULARY.length,categories:words.reduce((a,w)=>{for(const c of w.categories||[w.category])a[c]=(a[c]||0)+1;return a;},{})},
  limitations:['Spelling/heading presence does not establish the expected meaning, pronunciation, POS or learning quality. No learner mastery is measured.',
   'No automatic stemming, derivation, synonym substitution, global hyphen deletion or generic ise/ize conversion. Inflections and meanings require a separate review.',
   'Oxford nominal 3000/5000 labels differ from deduplicated normalized headword counts because labels contain homographs/POS/level repetitions and a/an notation. The extra PDF contains additional words only.',
   'The CET public 2016 PDF declares 5418 main entries / 2551 derivatives, while spatial extraction yields 5377 main printed rows / 2516 derivative cells. No complete official-5418 coverage claim; results are qualified extracted-group comparisons.',
   'Phrase headings include object placeholders and grammatical frames. Literal mentions in app text are separate evidence, not proof of structured teaching. Do not bulk create one card for every missing pattern.',
   'AWL uses 570 representative headwords for word families. Headword matching here is not family-member coverage and is not an official IELTS/TOEFL examination word list.',
   'Existing category labels are product scopes, not certification. Outside-category matches are mapping review candidates; no automatic retagging.',
   'No verified complete current postgraduate/IELTS/TOEFL exam list acquired in this audit; no percentages are invented for those tests.'],
  proposedWork:{newLearningUnits:50,newPhrases:30,newWords:20,existingFieldReviews:10,status:'proposal_only_no_import'},
  referenceSources:references.sources.map(({rows,...source})=>({...source,parsedRows:rows.length,localPdf:`output/vocabulary-coverage-2026-10-29/references/${source.id}.pdf`})),
  normalizationReviews:normalization,morphologyReviews:morphology,sourceFormattingReviews:formatting,unverifiedExamTargets:sourceRegistry.otherTargets,benchmarks,findings,posCues,categoryGaps};
 await mkdir(new URL(dataDir+'/',root),{recursive:true});
 await writeFile(new URL(`${dataDir}/report.json`,root),serialize(report));
 const csvCell=value=>'"'+String(value??'').replaceAll('"','""')+'"';
 const csv=[['benchmark','candidate','kind','level','sublist','source_pages','related_existing_forms','retired_ids','mentioned_in_app','near_spelling_ids_uncredited','morphology_parent_uncredited','source_format_status','suggested_spellings_uncredited'],...findings.map(r=>[r.benchmark,r.candidate,r.shape,r.level,r.sublist,r.refs.map(ref=>`${ref.sourceId}:${ref.page}`).join('|'),r.relatedDerivedForms.join('|'),r.retiredIds.join('|'),r.literalMentionInApp,r.nearSpellingCandidates.map(w=>w.id+':'+w.word).join('|'),r.morphologyReview?.parent||'',r.sourceFormatReview?.status||'',(r.sourceFormatReview?.suggestedSpellings||[]).join('|')])].map(row=>row.map(csvCell).join(',')).join('\n')+'\n';
 await writeFile(new URL(`${dataDir}/gaps.csv`,root),csv);
 const writeCsv=async(name,rows)=>writeFile(new URL(`${dataDir}/${name}`,root),rows.map(row=>row.map(csvCell).join(',')).join('\n')+'\n');
 await writeCsv('first-batch-proposal.csv',[
  ['candidate','kind','priority','meaning_direction_not_final_definition','scenario','source_levels','source_pages','status'],
  ...proposal.newCandidates.map(c=>[c.candidate,c.kind,c.priority,c.meaningDirection,c.scenario,c.sourceLevels.join('|'),c.sourceRefs.map(r=>`${r.sourceId}:${r.page}`).join('|'),c.status])]);
 await writeCsv('existing-field-reviews.csv',[['existing_id','headword','kind','priority','finding','recommendation'],...proposal.existingReviews.map(r=>[r.id,r.word,r.kind,r.priority,r.finding,r.recommendation])]);
 await writeCsv('category-mapping-review.csv',[
  ['benchmark','source_group','existing_ids','review_status'],...categoryGaps.map(c=>[c.benchmark,c.candidate,c.ids.join('|'),'mapping_review_not_a_new_word_or_error_verdict'])]);
 const cell=value=>String(value??'').replaceAll('|','\\|').replace(/\r?\n/g,' ');
 const table=(headers,rows)=>['| '+headers.join(' | ')+' |','| '+headers.map(()=> '---').join(' | ')+' |',...rows.map(row=>'| '+row.map(cell).join(' | ')+' |')].join('\n');
 const core=benchmarks.find(b=>b.id==='oxford3000'),full=benchmarks.find(b=>b.id==='oxford5000-union'),academic=benchmarks.find(b=>b.id==='awl-headwords'),phrase=benchmarks.find(b=>b.id==='oxford-phrases');
 const doc=[
 '# 词库覆盖对照与首批扩充候选（2026-10-29）','',
 '**本轮只读分析：当前词库、ID、学习记录、分类、例句和音频均未修改。总量仍为 8699 条，规范化不同词头 8697 个。以下数字是库存匹配，不是学习者掌握率，也不是义项或考试成绩认证。**','',
 `当前证据支持先补常用义项、短语学习单元和明确缺少的词。Oxford 3000 去重词头匹配 ${core.counts.available}/${core.counts.total}（${core.counts.inventoryMatchPercent}%）；两份核心／进阶PDF合并为 ${full.counts.available}/${full.counts.total}（${full.counts.inventoryMatchPercent}%）。词头已有基础，但存在 mean、can、cover、match 等基础字段的常用义项缺口。`,'',
 '## 对照口径与结果','',
 table(['参考／范围','本次去重单元','已有匹配','未命中待复核','计数说明'],benchmarks.map(b=>[b.title,b.counts.total,b.counts.available,b.counts.missing,b.id.startsWith('cet')?'公开2016 PDF解析组，非官方完整5418口径':b.id==='oxford-phrases'?'独立词卡／模式干匹配，非全部教学内容覆盖':`${b.counts.inventoryMatchPercent}% 词头库存匹配`])),'',
 '- Oxford 3000 的 3313 条词头／词性／等级行合并为 2981 个匹配词头；额外词表 2012 行合并为 1994 个词头；两表有同拼写不同用法交集，合并后 4953 个词头。品牌注记、同形词编号和义项括注均保留来源记录后处理，标称 3000/5000 不硬充当本次分母。','',
 '- 原四、六级大纲标称 5418 主词目／2551 派生词；已读词表全部129个PDF页面，空间提取为5377行主词目和2516个派生单元。标称与印刷组口径差异尚未获得独立解释，故不作“完整官方5418词覆盖率”结论。表中CET结果只描述本次可核验的去重印刷组；同形词可跨级，未标星与标星组不能直接相加。','',
 `- AWL 按 ${academic.counts.total} 个词族代表词计算，匹配 ${academic.counts.available}，未命中 ${academic.counts.missing}。这不是词族全部成员覆盖率，也不是雅思／托福官方必考词表。`,'',
 `- Oxford Phrase List 只取750个主要表头，排除浅色印刷示例，规范化为${phrase.counts.total}个匹配模式；${phrase.counts.available}个有独立词卡。其余${phrase.counts.missing}个没有独立匹配，其中${phrase.missingButMentioned}个在现有例句／提示中可找到字面出现。不能把它们全部说成网站没有教过，更不能机械新增${phrase.counts.missing}个词条。`,'',
 '## 核心词的具体差集','',
 `Oxford 3000 未命中：${findings.filter(f=>f.benchmark==='oxford3000').map(f=>f.candidate).join('、')}。其中除 ah 外，其余11项有已存在的基词关系，保留在“词形／词义待复核”队列；不通过自动词干化把它们视为已经教会，也不直接分配11个新ID。`,'',
 '例如 covered 对应的 cover 当前主要教“封面／盖子”，matching 的 match 当前主要教名词。应先补齐基词教学义，再决定是否为词汇化的分词／复数建立独立学习单元。','',
 '## 已有词条优先补充：10项','',
 table(['现有ID／词头','类型','复核发现','建议'],proposal.existingReviews.map(r=>[`${r.id} · ${r.word}`,r.kind==='base_sense_gap'?'补常用义':'对齐词性',r.finding,r.recommendation])),'',
 `此外程序产生${posCues.length}条来源词性与当前字段标签差异线索，尚未逐条语义定案；不同词性体系（如限定词与传统形容词标法）、多义和语域都可能导致差异。它们不是${posCues.length}个已确认错误。本轮逐项编辑复核仅限上表10项，指单模型检查，不是独立专家签字。`,'',
 '## 首批新增候选：50个学习单元','',
 '建议先选30个常用短语／表达和20个词（10个日常基础、10个学术／进阶）。这是产品编辑顺序，不是官方频率排名。中文只是候选教学义方向；没有定稿完整释义、例句、音频或分类，尚不具备直接导入条件。先前已退役的 christ、isle 只列为课程复核，不自动恢复或重新分配ID。','',
 table(['序号','候选','类型','教学义方向','来源等级／用途'],proposal.newCandidates.map(c=>[c.queueId,c.candidate,c.kind==='phrase'?'短语／表达':'词',c.meaningDirection,`${c.sourceLevels.join('/')} · ${c.scenario}`])),'',
 '词卡新增前应核源并定稿词性、常用义、完整简短双语例句及四音色音频；只补现有词义时复用原ID。新词不覆盖旧词、不复用退役ID，词书归属保留来源与版本。本轮没有进行这些导入或发布操作。','',
 '## 分类映射与真正新增的区别','',
 table(['当前产品范围','库内可对应参考组','该分类内可对应组','已有但在分类外'],benchmarks.filter(b=>b.category).map(b=>[b.category,b.counts.available,b.counts.categoryMatched,b.counts.availableOutsideCategory])),'',
 '这些是“若产品范围要对齐该参考”的课程映射线索，不能全部称为标签错误。“四级核心／六级核心”可能有意只选重点；派生词单列也使产品词条数与主词目组不可直接对比。建议明确完整词书与重点选集的范围后再补映射；库内已有的词不必为此再建一个ID。','',
 '## 变体、词形与结构的保护','',
 '- 只忽略大小写、规范Unicode标点及空白；删除出版社商标注记在NFKC之前完成。词表义项括注和同形词编号仅用于库存键，不代表对应义项已经覆盖。','- 九组明确登记、并限定现有ID的拼写／分写变体可匹配；résumé 仅因现有2043明确含简历名词义才接受，不给任意动词 resume 套用该名词。','- 不做通用去重音符、去连字符、拼接空格、-ise/-ize替换或词干化。work out 与 workout、every day 与 everyday、re-sign 与 resign 不自动合并。','- 相近拼写、已有派生形式、可能需恢复空格的CET词目均仅给待复核线索，不增加已覆盖数量。结构模板保留为模板，不把 X years old 直接当作待导入英文词头。','',
 '## 考研、雅思与托福','',
 '本轮未取得可核验完整当前考研词表，也未取得可作为完整官方基准的雅思／托福词目清单，三者均不报凭空覆盖率。现有IELTS／TOEFL分类保留原范围，AWL只作为独立学术参照。下一步可在明确版本及来源的词书上重复本流程。','',
 '## 来源与复现','',
 ...report.referenceSources.map(s=>`- [${s.title||s.id}](${s.url})：${s.pages}页，SHA-256 \`${s.sha256}\`。`),'',
 '原始PDF与完整抽取输入仅保存在忽略的 output/ 目录；本轮没有复制出版社释义、印刷示例进入产品。源文件固定哈希、页数、计数核验及其它目标状态在 reference-sources.json 中。','',
 '```bash',
 'python3 scripts/extract-vocabulary-benchmarks.py --download',
 'node scripts/audit-vocabulary-coverage.mjs',
 'node --test tests/vocabulary-coverage.test.mjs',
 '```','',
 'Python需pypdf、pdfplumber，可使用Codex提供的PDF依赖运行时。源PDF变化时哈希校验拒绝静默替换，需先审核新版本；当前数据库变化时需建立新的日期／基线，不覆盖这份历史快照。','',
 '## 交付与验证','',
 '- report.json：完整计数、未命中组、词性筛查及分类映射线索；gaps.csv：原始差集，含跨表重复、结构模板及待复核项，不是导入表。','- first-batch-proposal.json／csv：50个新增候选及10个现有ID建议；category-mapping-review.csv：只需课程映射复核的现有词。','- 新增8项针对性分析检查通过；5份源PDF哈希与提取元数据已核验。CET标称计数对齐仍未认证，按限定口径报告。',
 '- 本轮未改 public/data、src、shared、Worker目录或音频，8699个ID及学习记录保持原状。未重复运行全量应用测试或生产构建；完整只读／复现检查见同目录 verification.json。','- 未提交、推送或部署。',''
 ].join('\n');
 await mkdir(new URL('docs/',root),{recursive:true});
 await writeFile(new URL('docs/vocabulary-coverage-audit-2026-10-29.md',root),doc);
 assert.equal(hash(await readFile(new URL('public/data/vocabulary.json',root))),hash(raw),'Audit mutated canonical data');
 console.log(JSON.stringify({library:report.library,benchmarks:benchmarks.map(b=>({id:b.id,...b.counts})),posCues:posCues.length,categoryGaps:categoryGaps.length},null,2));
 return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await runCoverageAudit({referencePath:process.argv[2]});
