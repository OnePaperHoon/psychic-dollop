/**
 * 표본 자동 수집 — GitHub에서 `psychic-specimen` 토픽이 달린 레포들의
 * specimen.json을 읽어 projects/<이름>/specimen.js 를 생성한다.
 *
 * - 표본 정보의 소스는 각 표본 레포 (여기 projects/* 는 생성물)
 * - specimen.json의 deploy가 true가 아니면 launch 링크를 비워 "미배포" 처리
 * - CI에서 빌드 직전 실행 (GITHUB_TOKEN 권장 — rate limit)
 * - 로컬 갱신: npm run collect
 */
import { mkdir, writeFile } from "node:fs/promises";

const OWNER = "OnePaperHoon";
const TOPIC = "psychic-specimen";
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "psychic-dollop-collector",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

const q = encodeURIComponent(`user:${OWNER} topic:${TOPIC}`);
const res = await fetch(`https://api.github.com/search/repositories?q=${q}&per_page=100`, { headers });
if (!res.ok) throw new Error(`레포 검색 실패: ${res.status} ${await res.text()}`);
const { items } = await res.json();
if (!items?.length) throw new Error(`토픽 ${TOPIC} 레포가 없음 — 수집 중단 (기존 projects/ 유지)`);

let ok = 0;
for (const repo of items) {
  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${repo.name}/${repo.default_branch}/specimen.json`;
  const raw = await fetch(rawUrl, { headers: { "User-Agent": headers["User-Agent"] } });
  if (!raw.ok) {
    console.warn(`- ${repo.name}: specimen.json 없음 (${raw.status}) — 건너뜀`);
    continue;
  }
  let s;
  try {
    s = await raw.json();
  } catch (e) {
    console.warn(`- ${repo.name}: specimen.json 파싱 실패 — 건너뜀`);
    continue;
  }
  if (!s.id || !s.code) {
    console.warn(`- ${repo.name}: id/code 누락 — 건너뜀`);
    continue;
  }

  const deployed = s.deploy === true;
  const links = {
    launch: deployed ? (s.links?.launch ?? null) : null,
    download: deployed ? (s.links?.download ?? null) : null,
    repo: s.links?.repo ?? `https://github.com/${OWNER}/${repo.name}`,
    npm: s.links?.npm ?? null,
  };
  const hueKey = typeof s.hue === "string" ? s.hue : "ecto";

  const body = `// 자동 생성 파일 — 수정 금지. 소스: github.com/${OWNER}/${repo.name}/specimen.json
// 갱신: npm run collect (CI는 빌드마다 자동 실행)
import { PALETTE } from "../../src/theme.js";

export default {
  id: ${JSON.stringify(String(s.id))},
  code: ${JSON.stringify(s.code)},
  tag: ${JSON.stringify(s.tag ?? "")},
  status: ${JSON.stringify(s.status ?? "PROTOTYPE")},
  kind: ${JSON.stringify(s.kind ?? "web")},
  hue: PALETTE[${JSON.stringify(hueKey)}] ?? PALETTE.ecto,
  desc: ${JSON.stringify(s.desc ?? "")},
  vitals: ${JSON.stringify(s.vitals ?? { load: 50, entropy: 0.5, visc: 50 })},
  tags: ${JSON.stringify(s.tags ?? [])},
  links: ${JSON.stringify(links, null, 2).replace(/\n/g, "\n  ")},
};
`;
  const dir = `projects/${repo.name.toLowerCase()}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/specimen.js`, body, "utf8");
  console.log(`+ ${repo.name} → ${dir}/specimen.js (deploy: ${deployed})`);
  ok++;
}
if (!ok) throw new Error("수집된 표본이 0개 — 빌드 중단");
console.log(`완료: ${ok}개 표본 수집`);
