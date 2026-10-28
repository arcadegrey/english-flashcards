import { useEffect, useState } from 'react';

let request;
const loadCelebration = () => {
  request ??= import('./CorrectAnswerCelebration.jsx').catch(error => { request = null; throw error; });
  return request;
};

// Keep optional animation code out of startup; reward notices and persistence
// stay in StudyMomentum. A failed decoration can retry on the next reward.
export default function DeferredCelebration({ trigger }) {
  const [Animation, setAnimation] = useState(null);
  useEffect(() => {
    if (!trigger || Animation) return;
    let cancelled = false;
    loadCelebration().then(module => {
      if (!cancelled) setAnimation(() => module.default);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [trigger, Animation]);
  return trigger && Animation ? <Animation trigger={trigger} /> : null;
}
