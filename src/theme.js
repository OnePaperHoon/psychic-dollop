/* 디자인 토큰 — 색·상태 매핑. 새 색이 필요하면 여기 PALETTE에 명명 후 사용할 것. */

export const PALETTE = {
  void: "#08060f",
  chamber: "#15101d",
  ecto: "#ff2e97", // psychic magenta — the dollop
  coolant: "#24e0d0", // cyan — 계측/컨테인먼트
  hazard: "#ffb020", // amber — 경고
  danger: "#ff4d4d",
  bone: "#e8e4f0",
  ghost: "#8a7fa8",
};

export const STATUS = {
  DEPLOYED: { c: PALETTE.coolant, label: "배포됨" },
  LIVE: { c: PALETTE.ecto, label: "활동중" },
  PROTOTYPE: { c: PALETTE.hazard, label: "시제" },
  QUARANTINE: { c: PALETTE.hazard, label: "격리" },
  UNSTABLE: { c: PALETTE.danger, label: "불안정" },
  DORMANT: { c: PALETTE.ghost, label: "휴면" },
};
