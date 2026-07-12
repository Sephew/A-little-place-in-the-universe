export interface Scene {
  mount(root: HTMLElement): void;
  unmount(): void;
}

export type SceneFactory = () => Scene;

/** Mounts exactly one scene at a time; tears the previous one down first. */
export class SceneRouter {
  private current: Scene | null = null;

  constructor(private readonly root: HTMLElement) {}

  go(factory: SceneFactory): void {
    // ponytail: hard cut for now. The crossing transition (issue 10) hooks in
    // here — overlap old.unmount() with new.mount() behind a fade.
    this.current?.unmount();
    this.current = factory();
    this.current.mount(this.root);
  }

  get active(): Scene | null {
    return this.current;
  }
}
