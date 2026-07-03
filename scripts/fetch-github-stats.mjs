// Runs inside GitHub Actions. Uses the built-in GITHUB_TOKEN (never exposed to the browser)
// to snapshot repo/language/activity stats into data/github-stats.json, which the static
// site then reads at load time with zero API calls of its own.

import { writeFileSync } from "fs";

const USERNAME = process.env.GH_USERNAME || "Purushothaman-natarajan";
const TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Accept: "application/vnd.github+json",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  // 1. All public, non-fork repos
  let repos = [];
  let page = 1;
  while (true) {
    const batch = await gh(`/users/${USERNAME}/repos?per_page=100&page=${page}&type=owner`);
    repos = repos.concat(batch);
    if (batch.length < 100) break;
    page++;
  }
  repos = repos.filter((r) => !r.fork);

  // 2. Language bytes per repo, aggregated
  const languageTotals = {};
  for (const repo of repos) {
    try {
      const langs = await gh(`/repos/${USERNAME}/${repo.name}/languages`);
      for (const [lang, bytes] of Object.entries(langs)) {
        languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
      }
    } catch {
      // repo may be empty; skip
    }
  }
  const totalBytes = Object.values(languageTotals).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(languageTotals)
    .map(([name, bytes]) => ({ name, pct: +((bytes / totalBytes) * 100).toFixed(1) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8);

  // 3. Standout repos
  const byStars = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
  const byRecency = [...repos].sort(
    (a, b) => new Date(b.pushed_at) - new Date(a.pushed_at)
  )[0];

  const stats = {
    generatedAt: new Date().toISOString(),
    username: USERNAME,
    totalRepos: repos.length,
    totalStars: repos.reduce((s, r) => s + r.stargazers_count, 0),
    languages,
    mostStarred: byStars
      ? {
          name: byStars.name,
          description: byStars.description,
          stars: byStars.stargazers_count,
          url: byStars.html_url,
        }
      : null,
    mostRecentlyActive: byRecency
      ? {
          name: byRecency.name,
          description: byRecency.description,
          pushedAt: byRecency.pushed_at,
          url: byRecency.html_url,
        }
      : null,
  };

  writeFileSync("data/github-stats.json", JSON.stringify(stats, null, 2));
  console.log("Wrote data/github-stats.json:", stats);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
