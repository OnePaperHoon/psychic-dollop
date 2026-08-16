import React from "react";

/* ---------- 게이지 ---------- */
export default function Gauge({ label, v, unit, hue }) {
  return (
    <div className="pd-gauge">
      <div className="pd-gauge-top">
        <span>{label}</span>
        <span style={{ color: hue }}>
          {v}
          <small>{unit}</small>
        </span>
      </div>
      <div className="pd-gauge-bar">
        <div
          className="pd-gauge-fill"
          style={{ width: `${Math.min(100, v)}%`, background: hue, boxShadow: `0 0 8px ${hue}` }}
        />
      </div>
    </div>
  );
}
