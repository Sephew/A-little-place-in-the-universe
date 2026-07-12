import type { Scene } from '../scene';

const CSS = `
.lp-shader{position:absolute;inset:0;width:100%;height:100%;border:0}
.lp-overlay{position:absolute;inset:0;pointer-events:none;
  font-family:ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace;color:#e8e8ec}
.lp-nav{position:absolute;top:22px;left:0;right:0;display:flex;justify-content:center;gap:clamp(28px,6vw,64px)}
.lp-navlink{pointer-events:auto;color:#c9c9d1;text-decoration:none;font-size:13px;letter-spacing:.08em;opacity:.85}
.lp-navlink:hover{opacity:1}
.lp-card{position:absolute;left:5vw;top:50%;transform:translateY(-50%);max-width:420px;
  padding:34px 40px;border:1px solid rgba(255,255,255,.10);border-radius:14px;
  background:rgba(12,14,20,.28);backdrop-filter:blur(2px)}
.lp-title{margin:0 0 14px;font-weight:500;font-size:clamp(30px,5vw,46px);line-height:1.12;letter-spacing:.01em}
.lp-sub{margin:0 0 26px;font-size:14px;color:#aeb0ba;letter-spacing:.04em}
.lp-begin{pointer-events:auto;font:inherit;font-size:14px;letter-spacing:.06em;color:#15161c;
  background:#e9e9ee;border:0;border-radius:9px;padding:12px 20px;cursor:pointer}
.lp-begin:hover{background:#fff}
.lp-navlink:focus-visible,.lp-begin:focus-visible{outline:2px solid #8ab4ff;outline-offset:3px}
`;

function injectStyle() {
  if (document.getElementById('lp-style')) return;
  const s = document.createElement('style');
  s.id = 'lp-style';
  s.textContent = CSS;
  document.head.appendChild(s);
}

/**
 * The doorway. The Gargantua WebGL2 shader (with its own WebGL2 fallback and
 * drag-to-orbit) is reused verbatim as a full-bleed iframe; the hero card
 * overlays it. Begin Journey opens auth.
 *
 * ponytail: iframe reuse keeps the 800-line shader as one source of truth
 * instead of porting it into the scene. Native-integrate it (share the DPR /
 * reduced-motion plumbing) only if the iframe seam ever bites.
 */
export function landing(onBegin: () => void): Scene {
  const nodes: HTMLElement[] = [];

  return {
    mount(root) {
      injectStyle();

      const frame = document.createElement('iframe');
      frame.className = 'lp-shader';
      frame.src = '/gargantua.html';
      frame.title = 'Gargantua';
      root.appendChild(frame);

      const overlay = document.createElement('div');
      overlay.className = 'lp-overlay';
      overlay.innerHTML = `
        <nav class="lp-nav">
          <a class="lp-navlink" href="#">Home</a>
          <a class="lp-navlink" href="#">Explore</a>
          <a class="lp-navlink" href="#">Credits</a>
        </nav>
        <div class="lp-card">
          <h1 class="lp-title">Whisper into<br>the Universe</h1>
          <p class="lp-sub">A small pocket of the universe is waiting</p>
          <button class="lp-begin" type="button">Begin Journey</button>
        </div>`;
      root.appendChild(overlay);
      overlay
        .querySelector<HTMLButtonElement>('.lp-begin')!
        .addEventListener('click', onBegin);

      nodes.push(frame, overlay);
    },

    unmount() {
      nodes.forEach((n) => n.remove());
      nodes.length = 0;
    },
  };
}
