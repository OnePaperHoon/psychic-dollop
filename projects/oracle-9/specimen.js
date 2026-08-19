// 자동 생성 파일 — 수정 금지. 소스: github.com/OnePaperHoon/ORACLE-9/specimen.json
// 갱신: npm run collect (CI는 빌드마다 자동 실행)
import { PALETTE } from "../../src/theme.js";

export default {
  id: "005",
  code: "ORACLE-9",
  tag: "되묻기만 하는 심령 챗봇",
  status: "UNSTABLE",
  kind: "web",
  hue: PALETTE["danger"] ?? PALETTE.ecto,
  desc: "어떤 질문에도 답하지 않는다. 대신 당신의 질문을 더 날카롭게 되돌려준다. 세 번째 되물음에서 대부분의 사용자가 자리를 떴다.",
  vitals: {"load":88,"entropy":0.94,"visc":29},
  tags: ["chat","oracle","recursive"],
  links: {
    "launch": null,
    "download": null,
    "repo": "https://github.com/OnePaperHoon/ORACLE-9",
    "npm": null
  },
};
