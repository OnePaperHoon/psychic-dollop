import { PALETTE } from "./theme.js";

/* =========================================================
   STYLES — 키프레임 이름(pd-*)과 디자인 토큰은 유지할 것
   ========================================================= */
export const css = `
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

.pd-root{
  --void:${PALETTE.void}; --chamber:${PALETTE.chamber};
  --ecto:${PALETTE.ecto}; --coolant:${PALETTE.coolant};
  --hazard:${PALETTE.hazard}; --bone:${PALETTE.bone}; --ghost:${PALETTE.ghost};
  --crt:'VT323','Courier New',monospace;
  --mono:ui-monospace,'SF Mono',Menlo,'Courier New',monospace;
  position:relative; width:100%; min-height:100vh;
  background:
    radial-gradient(1200px 600px at 50% -10%, #1a0f2e 0%, transparent 60%),
    radial-gradient(900px 500px at 90% 110%, #170a20 0%, transparent 55%),
    var(--void);
  color:var(--bone); font-family:var(--mono);
  overflow:hidden; user-select:none;
  display:flex; flex-direction:column;
}
*::selection{ background:var(--ecto); color:#000; }

/* 앰비언트 */
.pd-scanlines{ position:absolute; inset:0; pointer-events:none; z-index:900;
  background:repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0, rgba(0,0,0,.28) 1px, transparent 2px, transparent 3px);
  mix-blend-mode:multiply; animation:pd-scan 8s linear infinite; }
.pd-vignette{ position:absolute; inset:0; pointer-events:none; z-index:1;
  background:radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,.7) 100%); }
.pd-sweep{ position:absolute; inset:0; z-index:950; pointer-events:none;
  background:linear-gradient(180deg, transparent, ${PALETTE.coolant}22, transparent);
  height:100%; animation:pd-sweep 1.1s ease-out forwards; }
@keyframes pd-scan{ to{ background-position:0 3px; } }
@keyframes pd-sweep{ 0%{ transform:translateY(-100%);} 100%{ transform:translateY(100%);} }

/* 상단 바 */
.pd-top{ position:relative; z-index:10; display:flex; justify-content:space-between;
  align-items:flex-end; padding:20px 26px 14px; border-bottom:1px solid #ffffff14; }
.pd-brand{ display:flex; flex-direction:column; gap:2px; }
.pd-brand .pd-glitch{ font-family:var(--mono); font-weight:800; font-size:26px;
  letter-spacing:.42em; text-transform:uppercase; color:var(--bone);
  text-shadow:0 0 18px ${PALETTE.ecto}55; }
.pd-sub{ font-family:var(--crt); font-size:16px; letter-spacing:.28em; color:var(--ghost); }
.pd-meta{ display:flex; gap:18px; font-family:var(--crt); font-size:17px;
  letter-spacing:.14em; color:var(--coolant); }
.pd-blink{ animation:pd-blink 1.4s steps(1) infinite; color:${PALETTE.danger}; }
@keyframes pd-blink{ 50%{ opacity:.15; } }

/* 스테이지 */
.pd-stage{ position:relative; z-index:5; flex:1;
  display:grid; grid-template-columns:230px 1fr 250px; align-items:stretch; }
@media(max-width:820px){ .pd-stage{ grid-template-columns:1fr; } }

/* 레일 공통 */
.pd-rail{ padding:26px 18px; display:flex; flex-direction:column; gap:12px; }
.pd-rail--left{ border-right:1px solid #ffffff10; }
.pd-rail--right{ border-left:1px solid #ffffff10; }

/* 좌 인덱스 */
.pd-idx{ display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:10px;
  background:transparent; border:1px solid transparent; border-radius:3px;
  padding:9px 11px; cursor:pointer; text-align:left; color:var(--ghost);
  transition:.22s; font-family:var(--mono); }
.pd-idx:hover{ border-color:#ffffff22; color:var(--bone); background:#ffffff06; }
.pd-idx.is-on{ border-color:${PALETTE.ecto}55; background:${PALETTE.ecto}0e;
  color:var(--bone); box-shadow:inset 0 0 22px ${PALETTE.ecto}18; }
.pd-idx-num{ font-family:var(--crt); font-size:19px; color:var(--coolant); letter-spacing:.05em; }
.pd-idx.is-on .pd-idx-num{ color:var(--ecto); }
.pd-idx-code{ font-size:12.5px; letter-spacing:.14em; font-weight:600; }
.pd-idx-dot{ width:7px; height:7px; border-radius:50%; }

/* 격리실 (중앙) */
.pd-vessel{ position:relative; display:flex; align-items:center; justify-content:center;
  overflow:hidden; }
.pd-vessel-frame{ position:absolute; inset:26px 40px; pointer-events:none;
  border:1px solid #ffffff12; border-radius:6px;
  background:radial-gradient(60% 55% at 50% 45%, ${PALETTE.chamber}cc, transparent 75%);
  box-shadow:inset 0 0 90px #000a; }
.pd-carousel{ position:absolute; inset:0; }
.pd-cell{ position:absolute; top:50%; left:50%; width:min(78%,360px);
  display:flex; flex-direction:column; align-items:center; gap:12px;
  background:transparent; border:none; cursor:pointer;
  transition:transform .5s cubic-bezier(.2,.8,.2,1), opacity .5s ease; }
.pd-cell-label{ text-align:center; display:flex; flex-direction:column; gap:3px; }
.pd-cell-id{ font-family:var(--crt); font-size:15px; letter-spacing:.28em; color:var(--ghost); }
.pd-cell-code{ font-size:22px; font-weight:800; letter-spacing:.24em; color:var(--bone);
  text-transform:uppercase; }
.pd-cell.is-active .pd-cell-code{ text-shadow:0 0 22px ${PALETTE.ecto}66; }
.pd-cell-tag{ font-size:13px; color:var(--ghost); letter-spacing:.03em; }
.pd-enter-hint{ margin-top:8px; font-family:var(--crt); font-size:15px; letter-spacing:.2em;
  color:var(--coolant); animation:pd-pulse 1.8s ease-in-out infinite; }
@keyframes pd-pulse{ 50%{ opacity:.35; } }

/* 상하 네비 */
.pd-nav{ position:absolute; left:50%; transform:translateX(-50%); z-index:60;
  background:#ffffff08; border:1px solid #ffffff1e; color:var(--bone);
  width:44px; height:30px; border-radius:4px; cursor:pointer; font-size:13px;
  transition:.2s; }
.pd-nav:hover:not(:disabled){ background:${PALETTE.coolant}22; border-color:${PALETTE.coolant}; color:var(--coolant); }
.pd-nav:disabled{ opacity:.2; cursor:not-allowed; }
.pd-nav--up{ top:16px; } .pd-nav--down{ bottom:16px; }

/* 우 계측 */
.pd-readout-title{ font-family:var(--crt); font-size:18px; letter-spacing:.2em; color:var(--coolant);
  border-bottom:1px solid #ffffff12; padding-bottom:8px; margin-bottom:4px; }
.pd-ekg{ background:#0004; border:1px solid #ffffff10; border-radius:3px; padding:2px 4px; }
.pd-gauge{ display:flex; flex-direction:column; gap:5px; }
.pd-gauge-top{ display:flex; justify-content:space-between; font-family:var(--crt);
  font-size:16px; letter-spacing:.12em; color:var(--ghost); }
.pd-gauge-top small{ font-size:11px; opacity:.7; margin-left:2px; }
.pd-gauge-bar{ height:6px; background:#ffffff10; border-radius:3px; overflow:hidden; }
.pd-gauge-fill{ height:100%; border-radius:3px; transition:width .5s ease; }
.pd-tags{ display:flex; flex-wrap:wrap; gap:7px; margin-top:6px; }
.pd-tags span{ font-family:var(--crt); font-size:14px; letter-spacing:.08em;
  color:var(--ghost); border:1px solid #ffffff14; padding:1px 7px; border-radius:2px; }
.pd-tags--big span{ font-size:16px; }

/* 하단 테이프 */
.pd-tape{ position:relative; z-index:10; overflow:hidden; white-space:nowrap;
  border-top:1px solid ${PALETTE.hazard}44; background:${PALETTE.hazard}0c;
  font-family:var(--crt); font-size:15px; letter-spacing:.18em; color:${PALETTE.hazard};
  padding:7px 0; }
.pd-tape-scroll{ display:inline-block; animation:pd-marquee 26s linear infinite; }
@keyframes pd-marquee{ to{ transform:translateX(-50%); } }

/* 블롭 애니메이션 */
.pd-blob{ position:absolute; inset:0;
  border-radius:42% 58% 63% 37% / 42% 42% 58% 58%;
  animation:pd-morph 7s ease-in-out infinite; }
.pd-blob--hi{ inset:6%; mix-blend-mode:screen; opacity:.9;
  animation-duration:5.5s; animation-direction:reverse; }
@keyframes pd-morph{
  0%,100%{ border-radius:42% 58% 63% 37% / 42% 42% 58% 58%; transform:rotate(0deg) scale(1); }
  33%{ border-radius:62% 38% 41% 59% / 58% 63% 37% 42%; transform:rotate(6deg) scale(1.04); }
  66%{ border-radius:38% 62% 57% 43% / 61% 38% 62% 39%; transform:rotate(-5deg) scale(.97); }
}

/* 글리치 텍스트 */
.pd-glitch{ position:relative; }
.pd-glitch::before,.pd-glitch::after{
  content:attr(data-txt); position:absolute; left:0; top:0; width:100%;
  overflow:hidden; opacity:.85; }
.pd-glitch::before{ color:${PALETTE.ecto}; clip-path:inset(0 0 55% 0);
  animation:pd-gl1 3.4s infinite steps(2); }
.pd-glitch::after{ color:${PALETTE.coolant}; clip-path:inset(55% 0 0 0);
  animation:pd-gl2 2.8s infinite steps(2); }
@keyframes pd-gl1{ 0%,92%,100%{ transform:translate(0); } 94%{ transform:translate(-2px,-1px); } 96%{ transform:translate(2px,1px); } }
@keyframes pd-gl2{ 0%,90%,100%{ transform:translate(0); } 93%{ transform:translate(2px,1px); } 97%{ transform:translate(-2px,-1px); } }

/* EKG */
@keyframes pd-ekg{ from{ stroke-dashoffset:520; } to{ stroke-dashoffset:0; } }

/* 오버레이 */
.pd-overlay{ position:fixed; inset:0; z-index:1000;
  background:radial-gradient(80% 80% at 50% 40%, #1a0d2b, var(--void) 80%);
  display:flex; align-items:center; justify-content:center; padding:40px;
  animation:pd-open .4s ease; }
@keyframes pd-open{ from{ opacity:0; filter:blur(8px); } to{ opacity:1; filter:blur(0); } }
.pd-seal{ position:absolute; top:22px; right:26px; z-index:5;
  background:${PALETTE.danger}14; border:1px solid ${PALETTE.danger}66; color:${PALETTE.danger};
  font-family:var(--crt); font-size:16px; letter-spacing:.15em; padding:5px 12px;
  border-radius:3px; cursor:pointer; transition:.2s; }
.pd-seal:hover{ background:${PALETTE.danger}30; }
.pd-detail{ position:relative; z-index:2; max-width:900px; width:100%;
  display:grid; grid-template-columns:300px 1fr; gap:44px; align-items:center; }
@media(max-width:720px){ .pd-detail{ grid-template-columns:1fr; gap:24px; text-align:center; } }
.pd-detail-viz{ display:flex; justify-content:center; }
.pd-detail-id{ font-family:var(--crt); font-size:17px; letter-spacing:.3em; color:var(--ghost); }
.pd-detail-code{ font-size:46px; font-weight:800; letter-spacing:.14em; margin:2px 0 6px;
  text-transform:uppercase; }
.pd-detail-tag{ font-size:16px; color:var(--coolant); margin-bottom:14px; letter-spacing:.04em; }
.pd-detail-desc{ font-size:15.5px; line-height:1.75; color:#cfc7e0; margin:18px 0;
  max-width:52ch; }
@media(max-width:720px){ .pd-detail-desc{ margin-inline:auto; } }
.pd-detail-actions{ display:flex; gap:14px; flex-wrap:wrap; margin-top:22px; }
@media(max-width:720px){ .pd-detail-actions{ justify-content:center; } }
.pd-launch{ font-family:var(--mono); font-size:14px; font-weight:700; letter-spacing:.14em;
  text-decoration:none; text-transform:uppercase;
  background:${PALETTE.ecto}; color:#0a0510; padding:13px 24px; border-radius:4px;
  box-shadow:0 0 26px ${PALETTE.ecto}66; transition:.2s; }
.pd-launch:hover{ transform:translateY(-1px); box-shadow:0 0 40px ${PALETTE.ecto}99; }
.pd-launch.is-off{ background:transparent; color:var(--ghost); border:1px dashed #ffffff2e;
  box-shadow:none; cursor:not-allowed; }
.pd-back{ background:transparent; border:1px solid #ffffff2a; color:var(--bone);
  font-family:var(--mono); font-size:13px; letter-spacing:.1em; padding:13px 20px;
  border-radius:4px; cursor:pointer; transition:.2s; }
.pd-back:hover{ border-color:var(--coolant); color:var(--coolant); }
.pd-link2{ background:transparent; border:1px solid #ffffff2a; color:var(--bone);
  font-family:var(--mono); font-size:13px; font-weight:700; letter-spacing:.1em;
  padding:13px 20px; border-radius:4px; text-decoration:none; text-transform:uppercase;
  transition:.2s; }
.pd-link2:hover{ border-color:var(--coolant); color:var(--coolant); }

/* 포커스 접근성 */
.pd-root button:focus-visible, .pd-root a:focus-visible{
  outline:2px solid ${PALETTE.coolant}; outline-offset:3px; }

/* reduced motion */
@media(prefers-reduced-motion:reduce){
  .pd-scanlines,.pd-blink,.pd-tape-scroll,.pd-glitch::before,.pd-glitch::after,
  .pd-enter-hint,.pd-blob{ animation:none !important; }
}
`;
