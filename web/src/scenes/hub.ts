import { makeCanvasScene } from './canvas-scene';
import type { Scene } from '../scene';

/** Placeholder hub (slice 1) plus a sign-out affordance so the auth loop is
 *  demoable end-to-end. Real hub arrival is slice 3. */
export function hub(onSignOut: () => void): Scene {
  const base = makeCanvasScene('hub — the void', 160);
  let btn: HTMLButtonElement | null = null;

  return {
    mount(root) {
      base.mount(root);
      btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'sign out';
      btn.style.cssText =
        'position:fixed;right:16px;top:16px;z-index:1;padding:8px 14px;' +
        'font:13px ui-monospace,monospace;color:#e8e8ec;background:#0008;' +
        'border:1px solid #fff3;border-radius:8px;cursor:pointer';
      btn.addEventListener('click', onSignOut);
      root.appendChild(btn);
    },
    unmount() {
      btn?.remove();
      btn = null;
      base.unmount();
    },
  };
}
