#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const JUNIT = path.join(ROOT, "runner/lib/junit-platform-console-standalone.jar");

const SLUGS = [
  "inventory-reservation-service",
  "rate-limiter-service",
  "password-strength-service",
  "pagination-service",
  "csv-parser-service",
  "discount-calculator-service",
  "user-search-service",
  "notification-router-service",
  "order-total-service",
  "audit-query-service",
];

async function collectJava(dir) {
  const out = [];
  async function walk(d) {
    const entries = await fs.readdir(d, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.name.endsWith(".java")) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

async function runWorkspace(workspaceDir) {
  const outDir = path.join(workspaceDir, "out");
  await fs.mkdir(outDir, { recursive: true });
  const sources = await collectJava(path.join(workspaceDir, "src"));
  execSync(
    `javac -encoding UTF-8 -cp "${JUNIT}" -d "${outDir}" ${sources.map((f) => `"${f}"`).join(" ")}`,
    { stdio: "pipe" }
  );
  return execSync(
    `java -jar "${JUNIT}" execute --class-path "${outDir}" --scan-class-path --disable-banner --details summary`,
    { encoding: "utf8" }
  );
}

async function main() {
  await fs.access(JUNIT);
  const { QUESTIONS } = await import("./generate-repo-questions.mjs");

  let failed = 0;
  for (const slug of SLUGS) {
    const m = JSON.parse(
      await fs.readFile(path.join(ROOT, "runner/questions", `${slug}.json`), "utf8")
    );
    const servicePath = Object.keys(m.starterTemplates)[0];
    const q = QUESTIONS.find((x) => x.slug === slug);
    const solution = q?.solution;
    if (!solution) {
      console.error(`No solution for ${slug}`);
      failed++;
      continue;
    }

    const tmp = path.join(ROOT, ".tmp-verify", slug);
    await fs.rm(tmp, { recursive: true, force: true });
    const merged = {
      ...m.readonlyFiles,
      ...m.visibleTests,
      ...m.hiddenTests,
      [servicePath]: solution,
    };
    for (const [p, c] of Object.entries(merged)) {
      const fp = path.join(tmp, p);
      await fs.mkdir(path.dirname(fp), { recursive: true });
      await fs.writeFile(fp, c);
    }

    try {
      const out = await runWorkspace(tmp);
      const ok = /(\d+) tests successful/.exec(out);
      const total = /(\d+) tests found/.exec(out);
      const pass = ok && total && ok[1] === total[1];
      console.log(`${slug}: ${pass ? "PASS" : "FAIL"} (${ok?.[1]}/${total?.[1]})`);
      if (!pass) {
        console.log(out.slice(0, 500));
        failed++;
      }
    } catch (e) {
      console.log(`${slug}: ERROR`, (e.stdout || e.message || "").toString().slice(0, 300));
      failed++;
    }
  }
  process.exit(failed ? 1 : 0);
}

main();
