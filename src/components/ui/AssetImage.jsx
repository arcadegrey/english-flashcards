import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { resolveImageAsset } from '../../utils/imageAssets';

function RecoverableImage({ src, variant, svg = false, retryPaused = false, onLoad, onError, ...props }) {
  const [revision, setRevision] = useState(0);
  const [fallback, setFallback] = useState(false);
  const retries = useRef(0);
  const failed = useRef(false);
  const timer = useRef(null);
  const paused = useRef(retryPaused);
  const pendingFallback = useRef(false);
  const resolved = resolveImageAsset(src, fallback ? undefined : variant);
  const retryable = typeof resolved === 'string' && resolved.startsWith('/images/');
  const retry = useCallback(() => {
    if (paused.current) return;
    clearTimeout(timer.current);
    failed.current = false;
    pendingFallback.current = false;
    setFallback(false);
    retries.current += 1;
    setRevision(value => value + 1);
  }, []);
  const scheduleRetry = () => {
    if (retryable && !paused.current && navigator.onLine && retries.current < 2) {
      timer.current = setTimeout(retry, 750 * 2 ** retries.current);
    }
  };

  useLayoutEffect(() => {
    paused.current = retryPaused;
    clearTimeout(timer.current);
    if (!retryPaused && pendingFallback.current) {
      timer.current = setTimeout(() => { pendingFallback.current = false; setFallback(true); }, 32);
    } else if (!retryPaused && failed.current && retryable && navigator.onLine && retries.current < 2) {
      timer.current = setTimeout(retry, 750 * 2 ** retries.current);
    }
  }, [retryPaused, retryable, retry]);

  useEffect(() => {
    const online = () => {
      if (!failed.current || !retryable) return;
      retries.current = 0;
      if (!paused.current) retry();
    };
    window.addEventListener('online', online);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener('online', online);
    };
  }, [retryable, retry]);

  const currentSrc = revision && retryable
    ? `${resolved}${resolved.includes('?') ? '&' : '?'}image-retry=${revision}`
    : resolved;
  const Image = svg ? 'image' : 'img';
  return <Image {...(svg ? { href: currentSrc } : { decoding: 'async', src: currentSrc })} {...props}
    onLoad={event => {
      failed.current = false;
      clearTimeout(timer.current);
      onLoad?.(event);
    }}
    onError={event => {
      failed.current = true;
      clearTimeout(timer.current);
      // Existing offline installations may have the original full delivery copy
      // without the new small variant. Keep that immutable URL usable via SW.
      if (variant && !fallback && !navigator.onLine) {
        if (paused.current) pendingFallback.current = true;
        else setFallback(true);
      } else scheduleRetry();
      onError?.(event);
    }} />;
}

export default function AssetImage({ src, variant, svg, ...props }) {
  return <RecoverableImage key={`${src}|${variant}|${svg}`} src={src} variant={variant} svg={svg} {...props} />;
}
