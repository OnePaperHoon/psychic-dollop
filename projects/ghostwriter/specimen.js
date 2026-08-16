import { PALETTE } from "../../src/theme.js";

export default {
  id: "001",
  code: "GHOSTWRITER",
  tag: "예측 텍스트 강령술",
  status: "DEPLOYED",
  kind: "web",
  hue: PALETTE.ecto,
  desc: "당신이 타이핑하기 직전에 문장을 대신 끝맺는다. 커서 뒤편에서 다음 단어를 미리 속삭이는 표본. 가끔 당신이 하려던 말보다 먼저 맞힌다.",
  vitals: { load: 72, entropy: 0.31, visc: 88 },
  tags: ["text", "prediction", "ghost"],
  links: { launch: null, repo: null },
};
