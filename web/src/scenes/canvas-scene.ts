import { Loop } from '../loop';
import { dpr, reducedMotion } from '../platform';
import type { Scene } from '../scene';

/**
 * Placeholder scene: a full-bleed canvas that slowly breathes a color and
 * labels itself, so the router switch is visible end-to-end. Real scenes
 * (landing/hub) replace this later; for now they only differ by label + hue.
 */
export function makeCanvasScene(label: string, hue: number): Scene {
  let canvas: HTMLCanvasElement | null = null;
  let loop: Loop | null = null;
  let onResize: (() => void) | null = null;

  return {
    mount(root) {
      canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:block;width:100%;height:100%';
      root.appendChild(canvas);
      const ctx = canvas.getContext('2d')!;

      const resize = () => {
        canvas!.width = Math.max(1, Math.round(root.clientWidth * dpr()));
        canvas!.height = Math.max(1, Math.round(root.clientHeight * dpr()));
      };
      resize();
      onResize = resize;
      window.addEventListener('resize', onResize);

      let t = 0;
      const draw = () => {
        if (!reducedMotion.matches) t += 0.02;
        const lum = 8 + Math.sin(t) * 4;
        ctx.fillStyle = `hsl(${hue} 45% ${lum}%)`;
        ctx.fillRect(0, 0, canvas!.width, canvas!.height);
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `${20 * dpr()}px system-ui, sans-serif`;
        ctx.fillText(label, 24 * dpr(), 44 * dpr());
      };

      loop = new Loop(draw);
      draw();
      loop.start();
    },

    unmount() {
      loop?.stop();
      if (onResize) window.removeEventListener('resize', onResize);
      canvas?.remove();
      loop = null;
      canvas = null;
      onResize = null;
    },
  };
}
