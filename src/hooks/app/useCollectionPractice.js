import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { COLLECTION_PRACTICE_SOURCES } from '../../../shared/collectionPractice.js';
import { EXAM_MODE_LABELS } from '../../../shared/examAttempts.js';
import { loadVocabularyByIds, hasBundledVocabularyId } from '../../data/vocabulary.js';
import { loadLearningView } from '../../utils/learningViewLoader.js';
import { loadCollectionPracticeView, loadCollectionAssessmentView } from '../../utils/pageViewLoader.js';
import { storage } from '../../utils/storage.js';

let toolsRequest;
const loadTools = () => toolsRequest ??= import('../../utils/collectionPractice.js')
  .catch(error => { toolsRequest = null; throw error; });

// Fixed word IDs belong to one account/source. Loading never adopts another
// account's or a departed page's request; unfinished mode drafts stay on disk.
export function useCollectionPractice(navigation, learning, ownerId) {
  const owner = String(ownerId || 'guest');
  const { view, mode, collectionRoute, setCollectionRoute, setView, setMode, setHomePanelRequest } = navigation;
  const [selected, setSelected] = useState(null);
  const [prepared, setPrepared] = useState(null);
  const [preparation, setPreparation] = useState(null);
  const [notice, setNotice] = useState('');
  const requestRef = useRef(0);
  const retryRef = useRef(null);
  const restore = useCallback(value => {
    if (String(storage.getLearningOwner()) === owner) setPrepared({ owner, source: value.snapshot.source, ...value });
  }, [owner]);
  useLayoutEffect(() => () => { requestRef.current += 1; }, [view, owner]);
  const current = request => request === requestRef.current && String(storage.getLearningOwner()) === owner;
  const selection = selected?.owner === owner && collectionRoute?.owner === owner
    && selected.source === collectionRoute.source && (selected.snapshot?.key || '') === collectionRoute.key ? selected : null;
  const active = prepared?.owner === owner && collectionRoute?.owner === owner
    && prepared.snapshot.key === collectionRoute.key && prepared.source === collectionRoute.source ? prepared : null;
  const visiblePreparation = preparation?.owner === owner && preparation.request === requestRef.current ? preparation : null;

  const startMode = async (nextMode, { fresh = false, selection: explicitSelection } = {}) => {
    const picked = explicitSelection || selection;
    if (!picked || picked.owner !== owner || !Object.hasOwn(EXAM_MODE_LABELS, nextMode)) return;
    const request = ++requestRef.current;
    retryRef.current = { owner, run: () => startMode(nextMode, { fresh, selection: picked }) };
    setPreparation({ owner, request, mode: nextMode, loading: true, error: '' }); setNotice('');
    try {
      const { readCollectionDraft, prepareCollectionVocabulary, collectionModeError, writeCollectionDraft } = await loadTools();
      if (!current(request)) return;
      const pending = readCollectionDraft(owner, picked.source, nextMode);
      const snapshot = !fresh && pending ? pending.collectionSnapshot : picked.snapshot;
      if (!snapshot) throw new Error('当前列表暂无可练习词，请返回集合重新选择。');
      const [words] = await Promise.all([
        prepareCollectionVocabulary(snapshot, { loadWords: loadVocabularyByIds,
          customWords: learning.customWords, isBuiltIn: hasBundledVocabularyId }),
        Promise.all([loadLearningView(nextMode), loadCollectionAssessmentView()]),
      ]);
      if (!current(request)) return;
      const invalid = collectionModeError(nextMode, words);
      if (invalid) throw new Error(invalid);
      // One atomic setItem replaces a draft only after explicit fresh intent
      // and successful preparation. A quota failure leaves the old draft intact.
      if (fresh || !pending) writeCollectionDraft(owner, nextMode, snapshot);
      setPrepared({ owner, source: picked.source, snapshot, words });
      setPreparation(null); setMode(nextMode);
      setCollectionRoute({ owner, source: picked.source, key: snapshot.key });
      setView('collectionAssessment');
    } catch (error) {
      if (current(request)) setPreparation({ owner, request, mode: nextMode, loading: false,
        error: error.message || '定向练习准备失败，草稿已保留。' });
    }
  };

  const open = async (source, words, preferredMode) => {
    if (!Object.hasOwn(COLLECTION_PRACTICE_SOURCES, source)) return;
    const request = ++requestRef.current;
    setPreparation({ owner, request, loading: true, error: '' }); setNotice('');
    retryRef.current = { owner, run: () => open(source, words, preferredMode) };
    try {
      const { collectionPracticeWords, readCollectionDrafts, createCollectionSnapshot } = await loadTools();
      if (!current(request)) return;
      const eligible = collectionPracticeWords(words);
      const pending = readCollectionDrafts(owner, source);
      if (!eligible.length && !Object.values(pending).some(Boolean)) throw new Error('当前列表暂无可练习词。');
      const [snapshot] = await Promise.all([
        eligible.length ? createCollectionSnapshot(source, eligible.map(word => word.id)) : null,
        loadCollectionPracticeView(),
      ]);
      if (!current(request)) return;
      const picked = { owner, source, snapshot, words: eligible };
      setSelected(picked); setPreparation(null);
      if (preferredMode && (!pending[preferredMode] || pending[preferredMode].collectionSnapshot.key === snapshot?.key)) {
        return startMode(preferredMode, { selection: picked });
      }
      setCollectionRoute({ owner, source, key: snapshot?.key || '' });
      setView('collectionPractice');
    } catch (error) {
      if (current(request)) setPreparation({ owner, request, loading: false, error: error.message || '词表准备失败，请重试。' });
    }
  };

  const backToCollection = () => {
    const source = collectionRoute?.owner === owner && Object.hasOwn(COLLECTION_PRACTICE_SOURCES, collectionRoute.source)
      ? collectionRoute.source : 'home';
    if (source === 'home') setHomePanelRequest(request => ({ panel: '', nonce: request.nonce + 1 }));
    setCollectionRoute(null); setMode('learn'); setView(source);
  };
  const backToPicker = () => {
    if (active) setSelected({ ...active });
    setPreparation(null); setView('collectionPractice');
  };
  const changeMode = async nextMode => {
    if (nextMode === 'learn') return backToCollection();
    if (nextMode === mode || !active) return;
    const request = ++requestRef.current;
    try {
      const { readCollectionDraft } = await loadTools();
      if (!current(request)) return;
      const pending = readCollectionDraft(owner, active.source, nextMode);
      if (pending && pending.collectionSnapshot.key !== active.snapshot.key) {
        setSelected({ ...active }); setNotice(`${EXAM_MODE_LABELS[nextMode]}还有另一份词表草稿，请选择继续或按当前列表重新开始。`);
        setView('collectionPractice'); return;
      }
      return startMode(nextMode, { selection: active });
    } catch {
      if (current(request)) {
        setNotice('切换失败，原草稿已保留，请重新选择题型。');
        backToPicker();
      }
    }
  };
  return { owner, selection, active, notice: collectionRoute?.owner === owner ? notice : '', preparation: visiblePreparation, restore,
    open, startMode, changeMode, backToCollection, backToPicker,
    retry: () => { if (retryRef.current?.owner === owner) retryRef.current.run(); } };
}
