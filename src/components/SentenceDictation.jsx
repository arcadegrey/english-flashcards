import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { DICTATION_MAX_LENGTH, dictationCandidates, evaluateDictation, isDictationExample } from '../../shared/dictation.js';
import { useWordDetails } from '../hooks/useWordDetails.js';
import { speakExample } from '../utils/speech.js';
import { createExamplePlayback } from '../utils/examplePlayback.js';
import { shuffle } from '../utils/random.js';
import { PrimaryButton, SecondaryButton } from './ui/Buttons';
import LoadingState from './ui/LoadingState';
import DictationFeedback from './assessment/DictationFeedback';
import '../styles/sentence-dictation.css';

function pickQuestion(candidates, answers, previousId) {
  const used = new Set(answers.map(answer => String(answer.wordId)));
  const fresh = candidates.filter(word => !used.has(String(word.id)) && String(word.id) !== String(previousId));
  const pool = fresh.length ? fresh : candidates.filter(word => String(word.id) !== String(previousId));
  return shuffle(pool.length ? pool : candidates)[0] || null;
}

function restoreQuestion(candidates, saved, answers) {
  if (!saved || typeof saved.input !== 'string' || saved.input.length > DICTATION_MAX_LENGTH) return null;
  const word = candidates.find(word => String(word.id) === String(saved?.wordId));
  if (!word) return null;
  const recorded = saved.recorded === true && answers.some(answer => String(answer.wordId) === String(word.id));
  return { wordId: word.id, input: saved.input, hintUsed: saved.hintUsed === true,
    submitted: recorded && saved.submitted === true, revealed: saved.revealed === true, recorded };
}

export default function SentenceDictation({ vocabulary, answers = [], initialQuestion, onQuestionChange, onAnswer }) {
  const [candidates] = useState(() => dictationCandidates(vocabulary));
  const [question, setQuestion] = useState(() => restoreQuestion(candidates, initialQuestion, answers)
    || { wordId: pickQuestion(candidates, answers)?.id, input: '', hintUsed: false, submitted: false, revealed: false, recorded: false });
  const selected = candidates.find(word => String(word.id) === String(question.wordId));
  const details = useWordDetails(selected);
  const word = details.word;
  const [player] = useState(() => createExamplePlayback(speakExample));
  const playback = useSyncExternalStore(player.subscribe, player.getSnapshot, player.getSnapshot);
  const inputRef = useRef(null);
  const submittedRef = useRef(question.submitted);
  useLayoutEffect(() => () => player.stop(), [player, question.wordId]);

  const update = next => { setQuestion(next); onQuestionChange?.(next); };
  const playing = playback.status === 'playing' || playback.status === 'preparing';
  const play = rate => { onQuestionChange?.(question); player.toggle(word, rate); };
  const check = (revealed = false) => {
    if (submittedRef.current || !isDictationExample(word) || !revealed && !question.input.trim()) return;
    submittedRef.current = true;
    player.stop();
    if (!question.recorded) onAnswer?.(!revealed && evaluateDictation(word.example, question.input).correct,
      { wordId: word.id, word: word.word, meaning: word.meaning, example: word.example,
        exampleCn: word.exampleCn || '', input: question.input, hintUsed: question.hintUsed, revealed });
    update({ ...question, submitted: true, revealed, recorded: true });
  };
  const next = () => {
    player.stop();
    const nextWord = pickQuestion(candidates, answers, question.wordId);
    submittedRef.current = false;
    update({ wordId: nextWord?.id, input: '', hintUsed: false, submitted: false, revealed: false, recorded: false });
    inputRef.current?.focus();
  };
  const retry = () => {
    player.stop();
    submittedRef.current = false;
    update({ ...question, input: '', submitted: false, revealed: false });
    inputRef.current?.focus();
  };

  if (!selected) return <div className="learn-refresh-empty-state" role="status"><h3>当前范围暂无可听写的例句</h3><p>请选择其他词库或测试范围后继续。</p></div>;
  if (details.error) return <div className="learn-refresh-empty-state" role="alert"><p>例句暂时无法加载，已保留当前输入。</p><SecondaryButton onClick={details.retry}>重试加载例句</SecondaryButton></div>;
  if (details.loading) return <LoadingState title="正在准备听写例句…" />;
  if (!isDictationExample(word)) return <div className="learn-refresh-empty-state" role="status"><p>这条词汇暂无适合听写的例句。</p><SecondaryButton onClick={next}>换一句</SecondaryButton></div>;
  const result = question.submitted ? evaluateDictation(word.example, question.input) : null;
  const correct = result?.correct && !question.revealed;
  return <div className="test-question-stage dictation-stage">
    <section className="learn-refresh-card dictation-card" aria-label="句子精听与听写">
      <header className="assessment-refresh-top"><div><p className="assessment-refresh-prompt">{question.submitted ? '核对原句，再精听一遍' : '听例句，写下你听到的整句'}</p><p className="dictation-caption">{question.recorded && !question.submitted ? '本句重练不重复计分。' : '可以重播或慢速听音，大小写和标点不计错。'}</p></div></header>
      <div className="dictation-player" aria-label="例句播放控制">
        <div className="dictation-player-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 17v-1a11 11 0 0 1 22 0v1M5 16h5v11H5zM22 16h5v11h-5zM13 23h6" /></svg></div>
        <div className="dictation-player-copy"><strong>{question.submitted ? '原句精听' : '先听，再动笔'}</strong><span role="status" aria-live="polite">{playback.status === 'preparing' ? '正在准备音频…' : playback.status === 'playing' ? '正在播放，再点一次可停止' : '点击播放，可反复听这句话'}</span></div>
        <div className="dictation-player-actions">
          <PrimaryButton onClick={() => play(1)} aria-pressed={playing && playback.rate === 1}>{playing && playback.rate === 1 ? '停止播放' : '播放例句'}</PrimaryButton>
          <SecondaryButton onClick={() => play(0.75)} aria-pressed={playing && playback.rate === 0.75}>{playing && playback.rate === 0.75 ? '停止慢速' : '慢速播放'}</SecondaryButton>
        </div>
      </div>
      {playback.error && <div className="dictation-audio-error" role="alert"><p>{playback.error}</p>{candidates.length > 1 && <SecondaryButton onClick={next}>换一句</SecondaryButton>}</div>}
      {!question.submitted ? <form onSubmit={event => { event.preventDefault(); if (!event.nativeEvent.isComposing) check(); }}>
        <label className="dictation-input-label" htmlFor="dictation-answer">听写内容</label>
        <textarea ref={inputRef} id="dictation-answer" className="dictation-input" value={question.input}
          onChange={event => update({ ...question, input: event.target.value })} maxLength={DICTATION_MAX_LENGTH}
          placeholder="在这里输入你听到的英文句子…" rows={4} lang="en" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          aria-describedby="dictation-answer-help" />
        <p className="dictation-caption" id="dictation-answer-help">按录音中的词序填写；缩写按听到的形式书写。</p>
        {question.hintUsed && <p className="dictation-translation" role="status">中文提示：{word.exampleCn || '这条例句暂未提供中文翻译。'}</p>}
        <div className="dictation-actions">
          <SecondaryButton disabled={question.hintUsed} onClick={() => update({ ...question, hintUsed: true })}>{question.hintUsed ? '已使用中文提示' : '中文提示'}</SecondaryButton>
          <SecondaryButton onClick={() => check(true)}>查看原文</SecondaryButton>
          <PrimaryButton type="submit" disabled={!question.input.trim()}>核对答案</PrimaryButton>
        </div>
        <p className="dictation-caption">查看原文后，本次记为待巩固；使用中文提示会保留标记。</p>
      </form> : <div className="dictation-review">
        <p className={`dictation-verdict ${correct ? 'is-correct' : 'is-wrong'}`} role="status">{question.revealed ? '已查看原文，本次记为待巩固。' : correct ? '整句听写正确。' : '还有词语需要核对，听原句后再试一次。'}{question.hintUsed && <span> 本次使用了中文提示。</span>}</p>
        <div className="dictation-original"><span className="dictation-input-label">原句</span><p lang="en">{word.example}</p><p>{word.exampleCn}</p></div>
        <DictationFeedback example={word.example} input={question.input} />
        <div className="dictation-actions"><SecondaryButton onClick={event => { if (event.detail < 2) retry(); }}>再练这句</SecondaryButton><PrimaryButton onClick={event => { if (event.detail < 2) next(); }}>下一句</PrimaryButton></div>
      </div>}
    </section>
  </div>;
}
