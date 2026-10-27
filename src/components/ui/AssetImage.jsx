import { useEffect, useRef, useState } from 'react';
import { resolveImageAsset } from '../../utils/imageAssets';

function RecoverableImage({ src, onLoad, onError, ...props }) {
  const [revision, setRevision] = useState(0);
  const retries = useRef(0);
  const failed = useRef(false);
  const timer = useRef(null);
  const resolved = resolveImageAsset(src);
  const retryable = typeof resolved === 'string' && resolved.startsWith('/images/');
  const retry = () => {
    clearTimeout(timer.current);
    failed.current = false;
    retries.current += 1;
    setRevision(value => value + 1);
  };

  useEffect(() => {
    const online = () => {
      if (!failed.current || !retryable) return;
      retries.current = 0;
      retry();
    };
    window.addEventListener('online', online);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener('online', online);
    };
  }, [retryable]);

  const currentSrc = revision && retryable
    ? `${resolved}${resolved.includes('?') ? '&' : '?'}image-retry=${revision}`
    : resolved;
  return <img decoding="async" {...props} src={currentSrc}
    onLoad={event => {
      failed.current = false;
      clearTimeout(timer.current);
      onLoad?.(event);
    }}
    onError={event => {
      failed.current = true;
      clearTimeout(timer.current);
      if (retryable && navigator.onLine && retries.current < 2) {
        timer.current = setTimeout(retry, 750 * 2 ** retries.current);
      }
      onError?.(event);
    }} />;
}

export default function AssetImage({ src, ...props }) {
  return <RecoverableImage key={src} src={src} {...props} />;
}
