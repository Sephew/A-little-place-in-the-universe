type Raf = (cb: FrameRequestCallback) => number;
type Caf = (id: number) => void;

/**
 * A requestAnimationFrame loop that can be started and cleanly stopped.
 * The scene router relies on stop() leaving zero pending frames so tearing
 * down a scene never leaks a RAF loop. raf/caf are injectable for tests.
 */
export class Loop {
  private id: number | null = null;

  constructor(
    private readonly tick: (dt: number) => void,
    private readonly raf: Raf = requestAnimationFrame,
    private readonly caf: Caf = cancelAnimationFrame,
  ) {}

  start(): void {
    if (this.id !== null) return; // idempotent — never run two loops
    let last = performance.now();
    const frame = (now: number) => {
      this.tick(now - last);
      last = now;
      this.id = this.raf(frame);
    };
    this.id = this.raf(frame);
  }

  stop(): void {
    if (this.id !== null) {
      this.caf(this.id);
      this.id = null;
    }
  }

  get running(): boolean {
    return this.id !== null;
  }
}
