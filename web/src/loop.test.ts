import { describe, it, expect } from 'vitest';
import { Loop } from './loop';

describe('Loop', () => {
  it('stop() cancels the pending frame and leaves nothing scheduled (no leaked RAF)', () => {
    let nextId = 1;
    const scheduled = new Set<number>();
    const raf = (_cb: FrameRequestCallback) => {
      const id = nextId++;
      scheduled.add(id);
      return id;
    };
    const caf = (id: number) => {
      scheduled.delete(id);
    };

    const loop = new Loop(() => {}, raf, caf);
    loop.start();
    expect(loop.running).toBe(true);
    expect(scheduled.size).toBe(1);

    loop.stop();
    expect(loop.running).toBe(false);
    expect(scheduled.size).toBe(0);
  });

  it('start() is idempotent — calling twice does not run two loops', () => {
    let calls = 0;
    const raf = () => ++calls;
    const loop = new Loop(() => {}, raf, () => {});

    loop.start();
    loop.start();

    expect(calls).toBe(1);
    expect(loop.running).toBe(true);
  });
});
