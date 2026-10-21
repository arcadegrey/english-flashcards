import { useCallback, useEffect, useRef, useState } from 'react';
import { requestApi } from '../utils/workerAuth';
import { readReadingAttempts, writeReadingAttempts } from '../utils/readingAttempts';
import { createReadingAttempt, mergeReadingAttempts, boundReadingAttemptCache } from '../../shared/readingAttempts.js';

export default function useReadingAttempts(ownerId) {
  const [data,setData]=useState(()=>readReadingAttempts(ownerId));
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const current=useRef(data);
  const active=useRef(true);
  const queue=useRef(Promise.resolve());
  const save=useCallback((value)=>{
    if (!active.current) return;
    // Persist first: storage failures must not report a saved practice.
    const bounded=boundReadingAttemptCache(value.attempts,value.pending);
    writeReadingAttempts(ownerId,bounded);
    current.current=bounded; setData(bounded);
  },[ownerId]);
  const sync=useCallback(()=>{
    if (!ownerId) return Promise.resolve();
    const operation=queue.current.catch(()=>{}).then(async()=>{
      if (!active.current) return;
      setBusy(true);setError('');
      try {
        for (const id of [...current.current.pending].reverse()) {
          const item=current.current.attempts.find(attempt=>attempt.id===id);
          if (!item) continue;
          const result=await requestApi('/reading-attempts',{method:'POST',expectedUserId:ownerId,signal:AbortSignal.timeout(15000),body:{...item,articleId:item.article.id}});
          if (!active.current) return;
          save({attempts:mergeReadingAttempts(current.current.attempts,[result.attempt]),pending:current.current.pending.filter(key=>key!==id)});
        }
        const result=await requestApi('/reading-attempts',{expectedUserId:ownerId,signal:AbortSignal.timeout(15000)});
        if (active.current) save({...current.current,attempts:[...current.current.attempts,...result.attempts,...current.current.attempts.filter(item=>current.current.pending.includes(item.id))]});
      } catch(err) { if(active.current)setError(err.message || '历史暂未同步，请重试。'); }
      finally { if(active.current)setBusy(false); }
    });
    queue.current=operation; return operation;
  },[ownerId,save]);
  useEffect(()=>{
    active.current=true;
    sync();
    const online=()=>sync(); window.addEventListener('online',online);
    return ()=>{active.current=false;window.removeEventListener('online',online);};
  },[sync]);
  const record=(values)=>{
    if (current.current.pending.length >= 100) throw new Error('待同步练习已达 100 次，请先同步历史后继续。');
    const attempt=createReadingAttempt({...values,id:values.id || crypto.randomUUID(),completedAt:values.completedAt || new Date().toISOString()});
    save({attempts:[...current.current.attempts,attempt],pending:ownerId ? [attempt.id,...current.current.pending] : []});
    sync();
    return attempt;
  };
  return {attempts:data.attempts,pending:data.pending.length,error,busy,sync,record};
}
