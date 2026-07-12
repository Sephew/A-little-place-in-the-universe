// App-wide plumbing every scene shares.

// Cap device-pixel-ratio so retina/hi-dpi phones don't blow up the fill rate.
export const DPR_CAP = 1.5;
export const dpr = (): number => Math.min(window.devicePixelRatio || 1, DPR_CAP);

const mq =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

export const reducedMotion = {
  get matches(): boolean {
    return mq?.matches ?? false;
  },
  /** Returns an unsubscribe fn. */
  subscribe(fn: (reduced: boolean) => void): () => void {
    if (!mq) return () => {};
    const handler = () => fn(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  },
};
