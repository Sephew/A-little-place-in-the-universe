var E=Object.defineProperty;var C=(n,t,e)=>t in n?E(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var m=(n,t,e)=>C(n,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=e(o);fetch(o.href,r)}})();class k{constructor(t){m(this,"current",null);this.root=t}go(t){var e;(e=this.current)==null||e.unmount(),this.current=t(),this.current.mount(this.root)}get active(){return this.current}}const S=`
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
`;function L(){if(document.getElementById("lp-style"))return;const n=document.createElement("style");n.id="lp-style",n.textContent=S,document.head.appendChild(n)}function z(n){const t=[];return{mount(e){L();const i=document.createElement("iframe");i.className="lp-shader",i.src="/gargantua.html",i.title="Gargantua",e.appendChild(i);const o=document.createElement("div");o.className="lp-overlay",o.innerHTML=`
        <nav class="lp-nav">
          <a class="lp-navlink" href="#">Home</a>
          <a class="lp-navlink" href="#">Explore</a>
          <a class="lp-navlink" href="#">Credits</a>
        </nav>
        <div class="lp-card">
          <h1 class="lp-title">Whisper into<br>the Universe</h1>
          <p class="lp-sub">A small pocket of the universe is waiting</p>
          <button class="lp-begin" type="button">Begin Journey</button>
        </div>`,e.appendChild(o),o.querySelector(".lp-begin").addEventListener("click",n),t.push(i,o)},unmount(){t.forEach(e=>e.remove()),t.length=0}}}class M{constructor(t,e=requestAnimationFrame,i=cancelAnimationFrame){m(this,"id",null);this.tick=t,this.raf=e,this.caf=i}start(){if(this.id!==null)return;let t=performance.now();const e=i=>{this.tick(i-t),t=i,this.id=this.raf(e)};this.id=this.raf(e)}stop(){this.id!==null&&(this.caf(this.id),this.id=null)}get running(){return this.id!==null}}const A=1.5,f=()=>Math.min(window.devicePixelRatio||1,A),h=typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,P={get matches(){return(h==null?void 0:h.matches)??!1}};function q(n,t){let e=null,i=null,o=null;return{mount(r){e=document.createElement("canvas"),e.style.cssText="display:block;width:100%;height:100%",r.appendChild(e);const a=e.getContext("2d"),s=()=>{e.width=Math.max(1,Math.round(r.clientWidth*f())),e.height=Math.max(1,Math.round(r.clientHeight*f()))};s(),o=s,window.addEventListener("resize",o);let l=0;const u=()=>{P.matches||(l+=.02);const c=8+Math.sin(l)*4;a.fillStyle=`hsl(${t} 45% ${c}%)`,a.fillRect(0,0,e.width,e.height),a.fillStyle="rgba(255,255,255,0.85)",a.font=`${20*f()}px system-ui, sans-serif`,a.fillText(n,24*f(),44*f())};i=new M(u),u(),i.start()},unmount(){i==null||i.stop(),o&&window.removeEventListener("resize",o),e==null||e.remove(),i=null,e=null,o=null}}}function I(n){const t=q("hub — the void",160);let e=null;return{mount(i){t.mount(i),e=document.createElement("button"),e.type="button",e.textContent="sign out",e.style.cssText="position:fixed;right:16px;top:16px;z-index:1;padding:8px 14px;font:13px ui-monospace,monospace;color:#e8e8ec;background:#0008;border:1px solid #fff3;border-radius:8px;cursor:pointer",e.addEventListener("click",n),i.appendChild(e)},unmount(){e==null||e.remove(),e=null,t.unmount()}}}function b(){throw new Error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (see .env.example)")}function N(n,t){const e=n.trim();return e?/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)?t.length<6?"Password must be at least 6 characters.":null:"That email looks off.":"Enter your email."}function T(n,t,e){const i=b().auth,o={email:t.trim(),password:e};return n==="register"?i.signUp(o):i.signInWithPassword(o)}const O=`
.au-backdrop{position:fixed;inset:0;z-index:10;display:flex;align-items:center;justify-content:center;
  background:rgba(3,4,8,.6);backdrop-filter:blur(3px);font-family:ui-monospace,Menlo,Consolas,monospace}
.au-modal{position:relative;width:min(360px,90vw);display:flex;flex-direction:column;gap:12px;
  padding:30px 28px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:#0c0e14;color:#e8e8ec}
.au-h{margin:0 0 6px;font-size:20px;font-weight:500}
.au-l{display:flex;flex-direction:column;gap:6px;font-size:12px;letter-spacing:.05em;color:#aeb0ba}
.au-in{font:inherit;font-size:14px;color:#e8e8ec;background:#15171f;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:10px 12px}
.au-err{min-height:16px;margin:0;font-size:12px;color:#ff9a9a}
.au-submit{font:inherit;font-size:14px;color:#15161c;background:#e9e9ee;border:0;border-radius:9px;padding:11px;cursor:pointer}
.au-submit:disabled{opacity:.6;cursor:default}
.au-toggle{font:inherit;font-size:12px;color:#9aa0b4;background:none;border:0;cursor:pointer}
.au-close{position:absolute;top:10px;right:12px;font-size:20px;line-height:1;color:#9aa0b4;background:none;border:0;cursor:pointer}
.au-in:focus-visible,.au-submit:focus-visible,.au-toggle:focus-visible,.au-close:focus-visible{outline:2px solid #8ab4ff;outline-offset:2px}
`;function B(){if(document.getElementById("au-style"))return;const n=document.createElement("style");n.id="au-style",n.textContent=O,document.head.appendChild(n)}function R(n){if(n.querySelector(".au-backdrop"))return;B();let t="login";const e=document.createElement("div");e.className="au-backdrop",e.innerHTML=`
    <form class="au-modal" novalidate>
      <button class="au-close" type="button" aria-label="Close">×</button>
      <h2 class="au-h">Begin Journey</h2>
      <label class="au-l">Email
        <input class="au-in" name="email" type="email" autocomplete="email" required></label>
      <label class="au-l">Password
        <input class="au-in" name="password" type="password" autocomplete="current-password" required></label>
      <p class="au-err" role="alert" aria-live="polite"></p>
      <button class="au-submit" type="submit">Log in</button>
      <button class="au-toggle" type="button">New here? Create an account</button>
    </form>`,n.appendChild(e);const i=e.querySelector("form"),o=e.querySelector(".au-err"),r=e.querySelector(".au-submit"),a=e.querySelector(".au-toggle"),s=i.elements.namedItem("email"),l=i.elements.namedItem("password"),u=d=>{d.key==="Escape"&&c()};function c(){document.removeEventListener("keydown",u),e.remove()}document.addEventListener("keydown",u),e.addEventListener("mousedown",d=>{d.target===e&&c()}),e.querySelector(".au-close").addEventListener("click",c),a.addEventListener("click",()=>{t=t==="login"?"register":"login",r.textContent=t==="login"?"Log in":"Create account",a.textContent=t==="login"?"New here? Create an account":"Have an account? Log in",l.autocomplete=t==="login"?"current-password":"new-password",o.textContent=""}),i.addEventListener("submit",async d=>{d.preventDefault();const y=N(s.value,l.value);if(y){o.textContent=y;return}r.disabled=!0,o.textContent="";try{const{error:p}=await T(t,s.value,l.value);if(p){o.textContent=p.message,r.disabled=!1;return}c()}catch(p){o.textContent=p instanceof Error?p.message:"Something went wrong. Try again.",r.disabled=!1}}),s.focus()}const w=document.getElementById("app"),x=document.createElement("div");x.style.cssText="position:fixed;inset:0";w.appendChild(x);const _=new k(x);async function $(){try{await b().auth.signOut()}catch{}}let v=null;function g(n){n!==v&&(v=n,_.go(n?()=>I($):()=>z(()=>R(w))))}async function H(){try{const n=b(),{data:t}=await n.auth.getSession();g(!!t.session),n.auth.onAuthStateChange((e,i)=>g(!!i))}catch{g(!1)}}H();
