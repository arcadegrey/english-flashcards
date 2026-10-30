import { evaluateDictation } from '../../../shared/dictation.js';

const labels = { missing: '漏写', extra: '多写', replacement: '需修改' };
export default function DictationFeedback({ example, input }) {
  const result = evaluateDictation(example, input);
  return <div className="dictation-comparison" aria-label="逐词核对">
    <p className="dictation-comparison-summary">匹配 {result.matched}/{result.total} 词
      {!result.correct && ` · 漏写 ${result.missing} · 多写 ${result.extra} · 需修改 ${result.replacements}`}</p>
    <ol className="dictation-tokens" lang="en">
      {result.parts.map((part, index) => <li key={index} className={`dictation-token is-${part.type}`}>
        {part.type !== 'correct' && <small lang="zh-CN">{labels[part.type]}</small>}
        {part.type === 'replacement' ? <><del>{part.actual}</del><strong>{part.expected}</strong></>
          : part.type === 'extra' ? <del>{part.actual}</del> : <span>{part.expected}</span>}
      </li>)}
    </ol>
  </div>;
}
