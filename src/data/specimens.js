/* projects/<이름>/specimen.js 자동 스캔 — 새 표본은 폴더 하나 추가로 끝. */
const modules = import.meta.glob("../../projects/*/specimen.js", { eager: true });

export const SPECIMENS = Object.values(modules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort((a, b) => a.id.localeCompare(b.id));
