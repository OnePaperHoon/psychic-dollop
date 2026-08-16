import React from "react";

/* ---------- 살아있는 돌롭 (점액 블롭) ---------- */
export default function Dollop({ hue, alive, size = 240, reduced }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        filter: alive
          ? `drop-shadow(0 0 40px ${hue}88) drop-shadow(0 0 90px ${hue}44)`
          : "grayscale(0.7) brightness(0.5)",
        transition: "filter .6s ease",
      }}
      aria-hidden
    >
      <div
        className="pd-blob"
        style={{
          width: "100%",
          height: "100%",
          background: `radial-gradient(circle at 35% 30%, ${hue}, ${hue}cc 40%, ${hue}55 70%, transparent 78%)`,
          animationPlayState: alive && !reduced ? "running" : "paused",
        }}
      />
      {/* 내부 하이라이트 (점액 반사) */}
      <div
        className="pd-blob pd-blob--hi"
        style={{
          background:
            "radial-gradient(circle at 40% 32%, rgba(255,255,255,.85), rgba(255,255,255,.15) 22%, transparent 45%)",
          animationPlayState: alive && !reduced ? "running" : "paused",
        }}
      />
    </div>
  );
}
