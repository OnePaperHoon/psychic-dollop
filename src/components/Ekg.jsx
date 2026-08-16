import React from "react";
import { PALETTE } from "../theme.js";

/* ---------- EKG 계측선 ---------- */
export default function Ekg({ hue, alive, reduced }) {
  return (
    <svg width="100%" height="46" viewBox="0 0 260 46" preserveAspectRatio="none">
      <polyline
        points="0,23 40,23 52,23 60,6 70,40 80,10 92,23 130,23 150,23 158,16 168,30 178,23 260,23"
        fill="none"
        stroke={alive ? hue : PALETTE.ghost}
        strokeWidth="1.6"
        strokeLinejoin="round"
        style={{
          filter: alive ? `drop-shadow(0 0 4px ${hue})` : "none",
          strokeDasharray: 520,
          animation: alive && !reduced ? "pd-ekg 2.4s linear infinite" : "none",
          opacity: alive ? 1 : 0.4,
        }}
      />
    </svg>
  );
}
