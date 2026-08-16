import { PALETTE } from "../../src/theme.js";

export default {
  id: "004",
  code: "REM-CATCHER",
  tag: "브라우저 안의 꿈 기록 장치",
  status: "QUARANTINE",
  kind: "web",
  hue: PALETTE.hazard,
  desc: "잠들기 직전 남긴 단어들을 밤새 재조립한다. 아침에 열어보면 당신이 쓰지 않은 문장들이 저장되어 있다. 격리 사유: 출처 불명.",
  vitals: { load: 41, entropy: 0.77, visc: 63 },
  tags: ["journal", "dream", "local"],
  links: { launch: null, repo: null },
};
