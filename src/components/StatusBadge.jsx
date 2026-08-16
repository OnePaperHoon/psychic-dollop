import React from "react";
import { STATUS } from "../theme.js";

/* ---------- 상태 배지 ---------- */
export default function StatusBadge({ status, small }) {
  const s = STATUS[status];
  return (
    <span
      style={{
        fontFamily: "var(--crt)",
        fontSize: small ? 13 : 15,
        letterSpacing: "0.15em",
        color: s.c,
        border: `1px solid ${s.c}66`,
        background: `${s.c}12`,
        padding: small ? "1px 7px" : "2px 10px",
        borderRadius: 2,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        boxShadow: `inset 0 0 12px ${s.c}22`,
      }}
    >
      ● {status} · {s.label}
    </span>
  );
}
