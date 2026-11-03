import { useEffect, useState } from 'react';
import AppLayout from '../layout/AppLayout';
import LoadingState from '../ui/LoadingState';
import { SecondaryButton } from '../ui/Buttons';
import { loadVocabularyByIds, hasBundledVocabularyId } from '../../data/vocabulary.js';
import { prepareCollectionVocabulary, readCollectionDraft, collectionModeError } from '../../utils/collectionPractice.js';
import { storage } from '../../utils/storage.js';

// The page is keyed by account/source/mode/snapshot. History restoration reads
// only that account's matching draft and never substitutes a different pool.
export default function CollectionAssessmentPage({ practice, route, mode, customWords, navItems, topbarProps, children }) {
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState(() => ({ words: practice.active?.words || null, error: '' }));
  const onRestored = practice.restore;
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      try {
        if (route?.owner !== practice.owner) throw new Error('账号已变化，请返回集合重新进入。');
        const draft = readCollectionDraft(practice.owner, route.source, mode);
        if (!draft || draft.collectionSnapshot.key !== route.key) throw new Error('这份练习已保存或草稿不可用，请返回集合重新选择。');
        const words = await prepareCollectionVocabulary(draft.collectionSnapshot,
          { loadWords: loadVocabularyByIds, customWords, isBuiltIn: hasBundledVocabularyId });
        const invalid = collectionModeError(mode, words);
        if (invalid) throw new Error(invalid);
        if (!cancelled && String(storage.getLearningOwner()) === practice.owner) {
          setState({ words, snapshot: draft.collectionSnapshot, error: '' });
          onRestored({ words, snapshot: draft.collectionSnapshot });
        }
      } catch (error) { if (!cancelled) setState({ words: null, error: error.message }); }
    };
    // An already prepared route needs no second load or mutable pool adoption.
    if (!state.words) restore();
    return () => { cancelled = true; };
  }, [practice.owner, route?.owner, route?.source, route?.key, mode, customWords, retry, state.words, onRestored]);
  const snapshot = state.snapshot || practice.active?.snapshot;
  if (state.words && snapshot && route?.owner === practice.owner && snapshot.key === route.key) return children({ snapshot, words: state.words });
  return <AppLayout active="test" title="定向巩固" navItems={navItems} topbarProps={topbarProps}>
    <div className="classroom-panel">
      {state.error ? <><p role="alert">{state.error}</p><SecondaryButton onClick={() => setRetry(value => value + 1)}>重试加载</SecondaryButton></>
        : <LoadingState title="正在恢复定向练习…" />}
      <SecondaryButton onClick={practice.backToCollection}>返回集合</SecondaryButton>
    </div>
  </AppLayout>;
}
