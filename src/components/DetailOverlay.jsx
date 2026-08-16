import React from "react";
import Dollop from "./Dollop.jsx";
import StatusBadge from "./StatusBadge.jsx";

/* kind별로 노출 순서·라벨이 다른 액션 링크. 첫 번째가 주(발광) 버튼이 된다. */
const LINK_LABELS = {
  launch: "표본 가동 · LAUNCH →",
  download: "반출 신청 · DOWNLOAD →",
  repo: "저장소 · REPO →",
  npm: "패키지 · NPM →",
};
const LINK_ORDER = ["launch", "download", "repo", "npm"];

/* ---------- 상세 오버레이 ---------- */
export default function DetailOverlay({ specimen: s, reduced, onClose }) {
  const actions = LINK_ORDER.filter((k) => s.links?.[k] && s.links[k] !== "#");
  return (
    <div className="pd-overlay" role="dialog" aria-modal="true" aria-label={s.code}>
      <div className="pd-scanlines" aria-hidden />
      <button className="pd-seal" onClick={onClose} aria-label="봉인">
        ✕ SEAL · ESC
      </button>

      <div className="pd-detail">
        <div className="pd-detail-viz">
          <Dollop hue={s.hue} alive reduced={reduced} size={reduced ? 200 : 260} />
        </div>
        <div className="pd-detail-body">
          <div className="pd-detail-id">
            SPECIMEN {s.id} · {(s.kind || "web").toUpperCase()}
          </div>
          <h2 className="pd-detail-code pd-glitch" data-txt={s.code}>
            {s.code}
          </h2>
          <div className="pd-detail-tag">{s.tag}</div>
          <StatusBadge status={s.status} />
          <p className="pd-detail-desc">{s.desc}</p>
          <div className="pd-tags pd-tags--big">
            {s.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
          <div className="pd-detail-actions">
            {actions.length ? (
              actions.map((k, i) => (
                <a
                  key={k}
                  className={i === 0 ? "pd-launch" : "pd-link2"}
                  href={s.links[k]}
                  target="_blank"
                  rel="noreferrer"
                >
                  {LINK_LABELS[k]}
                </a>
              ))
            ) : (
              <span className="pd-launch is-off">미배포 · NOT DEPLOYED</span>
            )}
            <button className="pd-back" onClick={onClose}>
              ← 아카이브로
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
