import { SceneRouter } from './scene';
import { landing } from './scenes/landing';
import { hub } from './scenes/hub';

const app = document.getElementById('app')!;

const stage = document.createElement('div');
stage.style.cssText = 'position:fixed;inset:0';
app.appendChild(stage);

const router = new SceneRouter(stage);

// Demo switch — proves landing ⇄ hub end-to-end. Real crossing is issue 10.
const btn = document.createElement('button');
btn.style.cssText =
  'position:fixed;right:16px;bottom:16px;z-index:1;padding:8px 14px;' +
  'font:14px system-ui;color:#fff;background:#0008;border:1px solid #fff4;border-radius:8px;cursor:pointer';
let atHub = false;
btn.textContent = 'cross →';
btn.onclick = () => {
  atHub = !atHub;
  router.go(atHub ? hub : landing);
  btn.textContent = atHub ? '← back' : 'cross →';
};
app.appendChild(btn);

router.go(landing);
