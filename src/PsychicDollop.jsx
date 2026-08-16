import React, { useState, useEffect, useCallback, useRef } from "react";
import { STATUS } from "./theme.js";
import { SPECIMENS } from "./data/specimens.js";
import { css } from "./styles.js";
import Dollop from "./components/Dollop.jsx";
import Ekg from "./components/Ekg.jsx";
import Gauge from "./components/Gauge.jsx";
import StatusBadge from "./components/StatusBadge.jsx";
import DetailOverlay from "./components/DetailOverlay.jsx";

/* ============================================================
   PSYCHIC DOLLOP — Specimen Archive
   매드 사이언티스트 랩 / 세로 캐러셀 셸
   ============================================================ */

export default function PsychicDollop() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && (window.innerWidth || 1024) <= 820
  );
  const wheelLock = useRef(false);

  const active = SPECIMENS[index];

  // 미디어 쿼리 (matchMedia 미지원 샌드박스에서도 안전하게)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasMM = typeof window.matchMedia === "function";

    const sync = () => {
      // reduced motion — matchMedia 있을 때만 판정, 없으면 false
      if (hasMM) {
        try {
          setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
        } catch (_) {}
      }
      // narrow — innerWidth 기반이 가장 견고
      try {
        setNarrow((window.innerWidth || 1024) <= 820);
      } catch (_) {}
    };
    sync();

    // matchMedia 리스너는 있을 때만, 형태별(addEventListener/addListener) 안전 바인딩
    const mqs = [];
    if (hasMM) {
      ["(prefers-reduced-motion: reduce)", "(max-width: 820px)"].forEach((q) => {
        try {
          const mq = window.matchMedia(q);
          if (mq.addEventListener) mq.addEventListener("change", sync);
          else if (mq.addListener) mq.addListener(sync);
          mqs.push(mq);
        } catch (_) {}
      });
    }
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("resize", sync);
      mqs.forEach((mq) => {
        try {
          if (mq.removeEventListener) mq.removeEventListener("change", sync);
          else if (mq.removeListener) mq.removeListener(sync);
        } catch (_) {}
      });
    };
  }, []);

  // 부팅 시퀀스
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), reduced ? 0 : 1100);
    return () => clearTimeout(t);
  }, [reduced]);

  const move = useCallback(
    (dir) => {
      setIndex((i) => Math.min(SPECIMENS.length - 1, Math.max(0, i + dir)));
    },
    []
  );

  // 키보드
  useEffect(() => {
    const onKey = (e) => {
      if (open) {
        if (e.key === "Escape") setOpen(false);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Enter") {
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, move]);

  const onWheel = (e) => {
    if (open) return;
    if (wheelLock.current) return;
    if (Math.abs(e.deltaY) < 8) return;
    wheelLock.current = true;
    move(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => (wheelLock.current = false), 420);
  };

  const SPACING = narrow ? 128 : 172;

  return (
    <div className="pd-root" onWheel={onWheel}>
      <style>{css}</style>

      {/* 앰비언트 레이어 */}
      <div className="pd-scanlines" aria-hidden />
      <div className="pd-vignette" aria-hidden />
      {!booted && !reduced && <div className="pd-sweep" aria-hidden />}

      {/* 상단 바 */}
      <header className="pd-top">
        <div className="pd-brand">
          <span className="pd-glitch" data-txt="PSYCHIC DOLLOP">
            PSYCHIC DOLLOP
          </span>
          <span className="pd-sub">표본 아카이브 · SPECIMEN ARCHIVE</span>
        </div>
        <div className="pd-meta">
          <span>SECTOR-Ψ</span>
          <span className="pd-blink">◉ REC</span>
          <span>
            {String(index + 1).padStart(2, "0")} / {String(SPECIMENS.length).padStart(2, "0")}
          </span>
        </div>
      </header>

      {/* 본체: 좌 인덱스 / 중앙 캐러셀 / 우 계측 */}
      <main className="pd-stage">
        {/* 좌: 인덱스 레일 */}
        {!narrow && (
          <nav className="pd-rail pd-rail--left" aria-label="표본 목록">
            {SPECIMENS.map((s, i) => (
              <button
                key={s.id}
                className={"pd-idx" + (i === index ? " is-on" : "")}
                onClick={() => setIndex(i)}
                aria-current={i === index}
              >
                <span className="pd-idx-num">{s.id}</span>
                <span className="pd-idx-code" data-txt={s.code}>
                  {s.code}
                </span>
                <span className="pd-idx-dot" style={{ background: STATUS[s.status].c }} />
              </button>
            ))}
          </nav>
        )}

        {/* 중앙: 세로 캐러셀 격리실 */}
        <div className="pd-vessel">
          <div className="pd-vessel-frame" aria-hidden />
          <div className="pd-carousel">
            {SPECIMENS.map((s, i) => {
              const dist = i - index;
              const ad = Math.abs(dist);
              const on = dist === 0;
              const opacity = ad === 0 ? 1 : ad === 1 ? 0.34 : ad === 2 ? 0.12 : 0;
              return (
                <button
                  key={s.id}
                  className={"pd-cell" + (on ? " is-active" : "")}
                  style={{
                    transform: `translate(-50%,-50%) translateY(${dist * SPACING}px) scale(${
                      on ? 1 : 0.8
                    })`,
                    opacity,
                    pointerEvents: on ? "auto" : ad <= 1 ? "auto" : "none",
                    zIndex: 50 - ad,
                  }}
                  onClick={() => (on ? setOpen(true) : setIndex(i))}
                  tabIndex={on ? 0 : -1}
                  aria-hidden={!on}
                >
                  <Dollop
                    hue={s.hue}
                    alive={on}
                    reduced={reduced}
                    size={narrow ? 150 : 210}
                  />
                  <div className="pd-cell-label">
                    <span className="pd-cell-id">SPECIMEN {s.id}</span>
                    <span className="pd-cell-code" data-txt={s.code}>
                      {s.code}
                    </span>
                    <span className="pd-cell-tag">{s.tag}</span>
                    {on && (
                      <span className="pd-enter-hint">
                        ⏎ 격리 해제 · ENTER
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 상하 나비게이션 */}
          <button
            className="pd-nav pd-nav--up"
            onClick={() => move(-1)}
            disabled={index === 0}
            aria-label="이전 표본"
          >
            ▲
          </button>
          <button
            className="pd-nav pd-nav--down"
            onClick={() => move(1)}
            disabled={index === SPECIMENS.length - 1}
            aria-label="다음 표본"
          >
            ▼
          </button>
        </div>

        {/* 우: 계측 레일 */}
        {!narrow && (
          <aside className="pd-rail pd-rail--right" aria-label="바이탈 계측">
            <div className="pd-readout-title">VITALS · {active.code}</div>
            <StatusBadge status={active.status} />
            <div className="pd-ekg">
              <Ekg hue={active.hue} alive reduced={reduced} />
            </div>
            <Gauge label="PSY-LOAD" v={active.vitals.load} unit="%" hue={active.hue} />
            <Gauge
              label="ENTROPY"
              v={Math.round(active.vitals.entropy * 100)}
              unit="Δ"
              hue={active.hue}
            />
            <Gauge label="VISCOSITY" v={active.vitals.visc} unit="cP" hue={active.hue} />
            <div className="pd-tags">
              {active.tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
          </aside>
        )}
      </main>

      {/* 하단 위험 테이프 */}
      <footer className="pd-tape" aria-hidden>
        <div className="pd-tape-scroll">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>
              ⚠ CONTAINMENT ACTIVE ⚠ 관찰 시 자기 책임 ⚠ 표본 반출 금지 ⚠ SECTOR-Ψ&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </footer>

      {/* 상세 오버레이 (격리 해제) */}
      {open && (
        <DetailOverlay specimen={active} reduced={reduced} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
