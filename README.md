# 🧪 Psychic Dollop

> 실험적으로 만든 것들을 "격리된 표본(specimen)"으로 모아두는 매드 사이언티스트 랩.
> 메인에서 세로 캐러셀로 표본을 넘겨보고, 골라 들어가 설명을 읽거나 배포된 걸 체험한다.

---

## 🖥️ 화면 구성

부팅 스캔 시퀀스 이후 격리실이 열린다.

```
┌────────────────────────────────────────────────────────┐
│ PSYCHIC DOLLOP  ·  표본 아카이브        SECTOR-Ψ ◉REC 02/06│
├──────────┬──────────────────────────────┬──────────────┤
│ 001 GHOST│           (휴면 표본 ▲)        │ VITALS       │
│ 002 DOLL◄│      ┌──────────────────┐     │ ▁▂▇▂▁ EKG    │
│ 003 SYNA │      │  ◍ 살아있는 돌롭   │     │ PSY-LOAD  99%│
│ 004 REM  │      │  SPECIMEN 002     │     │ ENTROPY   88Δ│
│ 005 ORAC │      │  ⏎ 격리 해제       │     │ VISCOSITY 12 │
│ 006 NULL │           (휴면 표본 ▼)        │ #cursor #goo │
├──────────┴──────────────────────────────┴──────────────┤
│ ⚠ CONTAINMENT ACTIVE ⚠ 표본 반출 금지 ⚠ SECTOR-Ψ ⚠ ...   │
└────────────────────────────────────────────────────────┘
```

- **활성 표본**만 꿈틀거리며 발광, 위아래 표본은 회색 휴면
- 휠 / ↑↓ / 좌측 인덱스로 이동, **Enter** 또는 클릭 → 상세 오버레이(LAUNCH), **Esc** 봉인

---

## 🚀 빌드 및 실행

정적 사이트로 **Cloudflare Pages** 배포 전제. 번들러는 Vite 권장.

```bash
# 최소 셋업 (Vite + React)
npm create vite@latest psychic-dollop -- --template react
# psychic-dollop.jsx 를 src/ 로 옮기고 main.jsx 에서 mount

npm install
npm run dev      # 로컬 개발
npm run build    # dist/ 정적 산출물
```

Cloudflare Pages: 빌드 커맨드 `npm run build`, 출력 디렉터리 `dist`.

> 컴포넌트는 `PsychicDollop` default export 하나라 어떤 React 진입점에도 그대로 붙는다.

---

## 📖 프로젝트 개요

### 목적
- 흩어져 있던 실험 프로젝트들을 하나의 세계관(격리 아카이브) 아래 모아 전시·체험시킨다.
- 각 실험을 "표본"으로 규격화해 추가를 데이터 한 줄로 끝낸다.

### 목표
- [x] 세로 캐러셀 인터랙션 (휠·키보드·인덱스)
- [x] 표본별 살아있는 시그니처 비주얼(돌롭)
- [x] 접근성 하한선 (키보드·포커스·reduced-motion·모바일)
- [ ] 표본 데이터 분리 및 라우트/딥링크
- [ ] 배포된 표본 iframe 체험 임베드

---

## 🔧 구현 내용

### 세로 캐러셀
전용 스크롤 대신 **인덱스 기반 변환**으로 표본을 위아래로 재배치. 활성으로부터의 거리(`dist`)로 위치·스케일·투명도를 계산해 "미끄러지는 격리실" 느낌을 만든다.

```jsx
const dist = i - index;               // 활성 기준 상대 위치
const ad = Math.abs(dist);
const opacity = ad === 0 ? 1 : ad === 1 ? 0.34 : ad === 2 ? 0.12 : 0;
// 활성만 정면·확대, 이웃은 축소·감광
transform: `translate(-50%,-50%) translateY(${dist * SPACING}px) scale(${dist===0 ? 1 : 0.8})`
```

### 시그니처: 돌롭(Dollop)
외부 라이브러리 없이 CSS `border-radius` morph로 점액질 블롭을 만든다. 활성일 때만 애니메이션 재생 + 발광, 아니면 정지·회색.

```css
@keyframes pd-morph{
  0%,100%{ border-radius:42% 58% 63% 37% / 42% 42% 58% 58%; transform:rotate(0) scale(1); }
  33%    { border-radius:62% 38% 41% 59% / 58% 63% 37% 42%; transform:rotate(6deg) scale(1.04); }
  66%    { border-radius:38% 62% 57% 43% / 61% 38% 62% 39%; transform:rotate(-5deg) scale(.97); }
}
```

### 계측·앰비언트
EKG는 `stroke-dashoffset` 애니메이션, 위험 테이프는 마퀴, 배경은 스캔라인 + 비네트 + 부팅 스윕. 타이틀 글리치는 `::before/::after`에 `data-txt`를 복제해 마젠타/시안으로 어긋나게 겹친다.

---

## 💡 배운 점

### matchMedia는 있다고 가정하면 안 된다 (개념 → 적용)
`window.matchMedia`는 표준 API지만 **일부 샌드박스/iframe에는 노출되지 않는다.** 이걸 무방비로 호출하면 첫 페인트 직후 이펙트 커밋 단계에서 `TypeError`가 나고, 컴포넌트가 언마운트되며 **잠깐 보이다가 흰 화면**이 된다.
→ 적용: `typeof window.matchMedia === "function"` feature-detect + `try/catch`로 감싸고, 화면 폭 판정은 항상 존재하는 `innerWidth` + `resize`를 1차 소스로 삼아 미지원 환경에서도 살아남게 함.

```jsx
const hasMM = typeof window.matchMedia === "function";
const sync = () => {
  if (hasMM) { try { setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (_) {} }
  try { setNarrow((window.innerWidth || 1024) <= 820); } catch (_) {}
};
```

### 라이브러리 없이 "살아있는" 질감
블롭을 이미지/캔버스 없이 `border-radius` 다중 값 + `radial-gradient` + `drop-shadow`만으로 표현. 활성 여부에 따라 `animationPlayState`를 토글해 비용을 활성 표본 하나로 제한했다.

### 모션은 끌 수 있어야 기본기
`prefers-reduced-motion`에서 블롭·글리치·스캔라인·EKG를 모두 정지시켜, 접근성과 브랜드 연출을 동시에 만족.

---

## 🔮 개선 가능 사항

- [ ] 표본 데이터 `data/specimens.js` 분리 → JSON/MDX 관리
- [ ] 표본별 딥링크(`?s=CODENAME`)와 브라우저 히스토리 연동
- [ ] 돌롭을 Canvas/WebGL 메타볼로 교체해 진짜 점액질 물리감
- [ ] 배포된 표본 iframe 임베드 + 로딩/에러 상태
- [ ] 사운드(가이거 계측음) 토글, 부팅 인트로 스킵 옵션
- [ ] 컴포넌트 단위 분리 및 스타일 모듈화

---

## 📚 참고 자료

- MDN — [`Window.matchMedia()`](https://developer.mozilla.org/docs/Web/API/Window/matchMedia)
- MDN — [`prefers-reduced-motion`](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion)
- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Vite — React 시작하기](https://vite.dev/guide/)

> C 프로젝트용 섹션(메모리 관리·valgrind·man pages)과 실측 없는 성능 수치는 이 프론트엔드 프로젝트에 해당하지 않아 생략했습니다.

---

## 📝 프로젝트 정보

- **환경**: React (정적 빌드), Cloudflare Pages 배포
- **언어**: JavaScript (JSX) + CSS-in-JS(`<style>` 주입)
- **의존성**: React / 폰트 VT323(Google Fonts, 폴백 monospace)
- **구조**: `psychic-dollop.jsx` 단일 컴포넌트 (`PsychicDollop` default export)
- **작성자**: OnePaperHoon
