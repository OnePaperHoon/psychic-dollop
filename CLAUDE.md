# CLAUDE.md — Psychic Dollop

> 실험적으로 만든 것들을 "격리된 표본(specimen)"으로 모아두는 매드 사이언티스트 랩 컨셉의 사이트.
> 메인에서 표본을 **세로 캐러셀**로 넘겨보고, 골라서 들어가면 설명을 읽거나 배포된 걸 체험한다.

이 문서는 Claude Code가 프로젝트 맥락·컨벤션·디자인 톤을 유지한 채 작업하도록 하는 지침이다.

---

## 스택 / 배포

- **React 18 + Vite 6** (`src/` 분리 구조, entry `src/main.jsx` → `PsychicDollop` mount)
- 스타일은 별도 CSS 파일 없이 `src/styles.js`의 `css` 문자열 → `<style>` 주입 (CSS 변수 기반)
- **배포: Cloudflare Workers** (Static Assets, Worker명 `psychic-dollop` → **psychicdollop.com**).
  `wrangler.jsonc`의 routes `custom_domain: true` 방식 — DNS 자동 생성, 대시보드 Routes 혼용 금지.
  main push → GitHub Actions → `wrangler deploy` 자동 배포
- 외부 의존성: 폰트 `VT323`만 Google Fonts `@import` (실패 시 monospace 폴백 → 렌더 지장 없음)

빌드 셋업을 붙일 때는 Vite + React 최소 구성으로:
`src/main.jsx`에서 `PsychicDollop`를 `#root`에 mount → `vite build` → `dist/`를 Cloudflare Pages에 배포.

---

## 파일 구조

```
src/
  main.jsx             # entry, mount
  PsychicDollop.jsx    # 메인 캐러셀 셸
  theme.js             # PALETTE + STATUS 디자인 토큰
  styles.js            # css 문자열 (키프레임 포함)
  data/specimens.js    # projects/*/specimen.js 자동 스캔 (import.meta.glob)
  components/
    Dollop.jsx         # 점액 블롭 (시그니처)
    Ekg.jsx  Gauge.jsx  StatusBadge.jsx  DetailOverlay.jsx
projects/
  <이름>/specimen.js   # 표본 하나 = 폴더 하나. 메타데이터 필수, 프로젝트 코드는 선택
```
> 구조를 바꾸더라도 **디자인 토큰과 애니메이션 키프레임 이름은 유지**할 것 (아래 참조).

---

## 데이터 모델 — 표본 추가법

표본 하나 = `projects/<이름>/specimen.js` 폴더 하나. `src/data/specimens.js`가
`import.meta.glob`으로 자동 스캔하므로 **폴더만 추가하면 등록 끝** (id 순 정렬).

```js
// projects/my-experiment/specimen.js
import { PALETTE } from "../../src/theme.js";

export default {
  id: "007",                 // 2~3자리 표본 번호 (정렬 기준)
  code: "CODENAME",          // 대문자 코드네임 (표시 핵심)
  tag: "한 줄 분류",          // 짧은 한글 설명
  status: "PROTOTYPE",       // DEPLOYED|LIVE|PROTOTYPE|QUARANTINE|UNSTABLE|DORMANT
  kind: "web",               // web|lib|desktop|cli — 프로젝트 유형 (상세에 표시)
  hue: PALETTE.ecto,         // 이 표본의 발광색 (PALETTE에서 선택)
  desc: "격리 보고서 톤의 설명. 실험적이고 약간 불온하게.",
  vitals: { load: 60, entropy: 0.5, visc: 40 }, // 우측 계측 게이지 값
  tags: ["react", "canvas"], // 소문자 기술 태그
  links: {                   // null/"#"은 미노출. 전부 비면 "미배포" 처리
    launch: null,            // web: 배포 주소 (첫 유효 링크가 주 발광 버튼)
    download: null,          // desktop: 릴리즈 다운로드
    repo: null,              // 저장소
    npm: null,               // lib: 패키지
  },
};
```

규칙:
- `status`는 `STATUS` 맵에 정의된 키만 사용 (색·라벨 자동 매핑).
- 액션 버튼은 `links`에서 값이 있는 것만 `launch → download → repo → npm` 순으로 노출.
  첫 번째가 주(발광) 버튼, 나머지는 보조 버튼. 라벨은 `DetailOverlay.jsx`의 `LINK_LABELS`.
- 웹 프로젝트는 코드를 `projects/<이름>/` 안에 같이 두고 같은 도메인(`/p/<이름>/`)으로
  서빙하는 방향도 열려 있음 (로드맵 참조). 라이브러리/데스크톱은 메타데이터 + 링크만.
- `vitals` 값은 게이지 표시용 연출 수치(임의). `entropy`는 0~1, 나머지 0~100.
- **copy 톤**: 임상 보고서 + 심령 실험. 판매문구 금지, 불온하고 구체적으로.

---

## 디자인 시스템 (이 톤을 벗어나지 말 것)

**팔레트** (`PALETTE`)
- `void` `#08060f` — 멍든 보라-블랙 배경
- `chamber` `#15101d` — 격리 패널
- `ecto` `#ff2e97` — 심령 마젠타 (점액/주 강조)
- `coolant` `#24e0d0` — 냉각 시안 (계측/UI 글로우)
- `hazard` `#ffb020` — 위험 앰버 (경고)
- `danger` `#ff4d4d` / `bone` `#e8e4f0` / `ghost` `#8a7fa8`

**타이포**: `--crt`(VT323, 계측/라벨) + `--mono`(system monospace, 본문/UI). 대문자 + 넓은 letter-spacing으로 "표본 라벨" 느낌.

**시그니처**: 표본마다 살아있는 **돌롭(Dollop)** — CSS `border-radius` morph 블롭. 활성 표본만 꿈틀+글로우, 나머지는 회색 휴면.

**모션 원칙**: 부팅 스캔 시퀀스 / 타이틀 글리치 / CRT 스캔라인 / EKG stroke-dash / 위험 테이프 마퀴. 남발 금지 — 활성 표본 하나에 집중.

키프레임: `pd-morph pd-scan pd-sweep pd-ekg pd-blink pd-marquee pd-glitch(::before/::after)`.

---

## 필수 준수 (하드 룰)

- **`window.matchMedia`는 항상 feature-detect + try/catch**. 미지원 환경에서 이펙트가 죽어 흰 화면이 된 이력이 있음. 폭 판정은 `innerWidth` + `resize`를 기본으로.
- **`prefers-reduced-motion` 존중** — `reduced`일 때 블롭/글리치/스캔라인/EKG 정지.
- **접근성 유지** — 키보드(↑↓ 이동, Enter 진입, Esc 봉인), `:focus-visible` 아웃라인, 모바일(≤820px) 레일 숨김·스택.
- `localStorage`/`sessionStorage` 사용 금지 (정적 사이트 유지, 상태는 React state로).
- 색·폰트·모션은 위 토큰에서 파생. 새 색이 필요하면 PALETTE에 명명 후 사용.

---

## 로드맵 (열린 방향)

- [x] 표본 데이터 폴더 구조로 분리 (`projects/*/specimen.js` 자동 스캔)
- [ ] 웹 표본 코드를 `projects/<이름>/`에 두고 빌드 시 `dist/p/<이름>/`으로 합쳐 같은 도메인 서빙
- [ ] 표본별 라우트/딥링크 (`?s=CODENAME` 또는 해시)
- [ ] 돌롭을 Canvas/WebGL 메타볼로 강화 (진짜 점액질)
- [ ] 배포된 표본 iframe 임베드 체험
- [ ] 사운드(가이거 계측음) 토글, 부팅 인트로 스킵
- [ ] Cloudflare Pages CI (main push → 자동 배포)
