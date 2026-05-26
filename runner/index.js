import cors from "cors";
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.RUNNER_PORT || 8787);
const RUNNER_SECRET = process.env.RUNNER_SECRET || "";
const DOCKER_IMAGE = process.env.DOCKER_IMAGE || "crons-java-runner";
/** Local JDK is the default; set USE_DOCKER=true only when Docker is installed. */
const USE_DOCKER = process.env.USE_DOCKER === "true";

const manifests = new Map();

async function loadManifests() {
  const dir = path.join(__dirname, "questions");
  const entries = await fs.readdir(dir);
  for (const file of entries) {
    if (!file.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const m = JSON.parse(raw);
    manifests.set(m.slug, m);
  }
}

function sanitizePath(p) {
  const norm = path.normalize(p).replace(/^(\.\.(\/|\\|$))+/, "");
  if (norm.startsWith("..") || path.isAbsolute(norm)) return null;
  return norm;
}

function isTestPath(p) {
  return p.includes("/test/") || p.includes("\\test\\");
}

function isCorruptMainSource(filePath, content) {
  if (!filePath.includes("src/main/java") || !filePath.endsWith(".java")) {
    return false;
  }
  const c = String(content);
  if (/org\.junit\.jupiter/.test(c)) return true;
  if (/class\s+SolutionTest\b/.test(c)) return true;
  if (/class\s+SolutionHiddenTest\b/.test(c)) return true;
  if (/class\s+PairMatchServiceTest\b/.test(c)) return true;
  if (filePath.endsWith("Solution.java") && !/class\s+Solution\b/.test(c)) {
    return true;
  }
  if (
    filePath.endsWith("PairMatchService.java") &&
    !/class\s+PairMatchService\b/.test(c)
  ) {
    return true;
  }
  return false;
}

function prepareMergedFiles(manifest, userFiles) {
  const merged = { ...userFiles };

  for (const p of Object.keys(merged)) {
    if (isTestPath(p)) delete merged[p];
  }

  const starters = manifest.starterTemplates || {};
  for (const [p, template] of Object.entries(starters)) {
    const user = merged[p];
    if (!user || isCorruptMainSource(p, user)) {
      merged[p] = template;
    }
  }

  Object.assign(merged, manifest.readonlyFiles || {});
  Object.assign(merged, manifest.visibleTests || {});
  Object.assign(merged, manifest.hiddenTests || {});

  return merged;
}

function stripAnsi(text) {
  return text.replace(/\x1b\[[0-9;]*m/g, "");
}

function testClassBefore(text, index) {
  const before = text.slice(Math.max(0, index - 600), index);
  const lastHidden = before.lastIndexOf("SolutionHiddenTest");
  const lastVisible = before.lastIndexOf("SolutionTest");
  if (lastHidden > lastVisible) return "SolutionHiddenTest";
  if (lastVisible >= 0) return "SolutionTest";
  return "Test";
}

function parseJUnitOutput(stdout) {
  const text = stripAnsi(stdout);
  /** @type {Map<string, { name: string, status: string, message?: string }>} */
  const byMethod = new Map();

  const foundM = text.match(/\[\s*(\d+)\s+tests found\s*\]/i);
  const successM = text.match(/\[\s*(\d+)\s+tests successful\s*\]/i);
  const total = foundM ? Number(foundM[1]) : 0;
  const passed = successM ? Number(successM[1]) : 0;

  function upsert(method, entry) {
    const existing = byMethod.get(method);
    if (!existing) {
      byMethod.set(method, entry);
      return;
    }
    if (
      entry.message &&
      (!existing.message || existing.message.length < entry.message.length)
    ) {
      existing.message = entry.message;
    }
    if (entry.name.includes(".") && !existing.name.includes(".")) {
      existing.name = entry.name;
    }
    existing.status = entry.status;
  }

  // Failed tests: "JUnit Jupiter:SolutionTest:exampleOne()"
  const failureRe = /JUnit Jupiter:([^:\n]+):([^\(\)\n]+)\(\)/g;
  let m;
  while ((m = failureRe.exec(text)) !== null) {
    const method = m[2];
    const name = `${m[1]}.${method}`;
    const slice = text.slice(m.index, m.index + 800);
    const msgM = slice.match(/AssertionFailedError:\s*([^\n]+)/);
    upsert(method, {
      name,
      status: "failed",
      message: msgM?.[1]?.trim(),
    });
  }

  // Passed tests from tree (only methods not already recorded as failed)
  const treePassRe = /(\w+)\(\)\s+✔/g;
  while ((m = treePassRe.exec(text)) !== null) {
    const method = m[1];
    if (byMethod.has(method) && byMethod.get(method).status === "failed") {
      continue;
    }
    const cls = testClassBefore(text, m.index);
    upsert(method, {
      name: `${cls}.${method}`,
      status: "passed",
    });
  }

  const results = Array.from(byMethod.values());

  return {
    passed: total > 0 ? passed : 0,
    total,
    results,
    stdout,
  };
}

function runDocker(workspaceDir) {
  return new Promise((resolve, reject) => {
    const args = [
      "run",
      "--rm",
      "--network=none",
      "--memory=512m",
      "--cpus=1",
      "-v",
      `${workspaceDir}:/workspace`,
      DOCKER_IMAGE,
    ];
    const proc = spawn("docker", args, { timeout: 30000 });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));
    proc.on("error", (err) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            "Docker is not installed. Run the runner with USE_DOCKER=false and JDK 17+ installed, or install Docker.",
          ),
        );
      } else {
        reject(err);
      }
    });
    proc.on("close", (code) => {
      resolve({ code, stdout: stdout + stderr });
    });
  });
}

async function collectJavaFiles(dir, out = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await collectJavaFiles(full, out);
      else if (e.name.endsWith(".java")) out.push(full);
    }
  } catch {
    /* missing src tree */
  }
  return out;
}

async function runLocal(workspaceDir) {
  const junit = path.join(__dirname, "lib", "junit-platform-console-standalone.jar");
  try {
    await fs.access(junit);
  } catch {
    throw new Error(
      "JUnit jar missing. Run: bash scripts/setup-runner.sh",
    );
  }

  const outDir = path.join(workspaceDir, "out");
  await fs.mkdir(outDir, { recursive: true });

  const sources = await collectJavaFiles(path.join(workspaceDir, "src"));
  if (sources.length === 0) {
    return { code: 1, stdout: "COMPILE_ERROR: No .java files under src/" };
  }

  const { execSync } = await import("child_process");
  const fileArgs = sources.map((f) => `"${f}"`).join(" ");
  try {
    execSync(
      `javac -encoding UTF-8 -cp "${junit}" -d "${outDir}" ${fileArgs}`,
      { cwd: workspaceDir, stdio: "pipe", maxBuffer: 2 * 1024 * 1024 },
    );
    const stdout = execSync(
      `java -jar "${junit}" execute --class-path "${outDir}" --scan-class-path --disable-banner --details tree`,
      { cwd: workspaceDir, encoding: "utf8", timeout: 25000, maxBuffer: 2 * 1024 * 1024 },
    );
    return { code: 0, stdout };
  } catch (e) {
    const errMsg = e.message ?? "";
    if (errMsg.includes("ENOENT") || errMsg.includes("not found")) {
      throw new Error(
        "Java JDK not found. Install JDK 17+ (e.g. brew install openjdk@17) and ensure javac/java are on your PATH.",
      );
    }
    const out = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
    return { code: e.status ?? 1, stdout: out };
  }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "512kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, mode: USE_DOCKER ? "docker" : "local-jdk" });
});

app.post("/v1/run", async (req, res) => {
  if (RUNNER_SECRET) {
    const auth = req.headers.authorization || "";
    if (auth !== `Bearer ${RUNNER_SECRET}`) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  }

  const { questionSlug, files } = req.body || {};
  if (!questionSlug || !files || typeof files !== "object") {
    res.status(400).json({ error: "questionSlug and files required" });
    return;
  }

  const manifest = manifests.get(questionSlug);
  if (!manifest) {
    res.status(404).json({ error: `Unknown question: ${questionSlug}` });
    return;
  }

  const start = Date.now();
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "crons-run-"));

  try {
    const merged = prepareMergedFiles(manifest, files);
    for (const [filePath, content] of Object.entries(merged)) {
      const safe = sanitizePath(filePath);
      if (!safe) continue;
      const full = path.join(tmp, safe);
      await fs.mkdir(path.dirname(full), { recursive: true });
      await fs.writeFile(full, content, "utf8");
    }

    const { code, stdout } = USE_DOCKER
      ? await runDocker(tmp)
      : await runLocal(tmp);

    const durationMs = Date.now() - start;

    if (
      stdout.includes("COMPILE_ERROR") ||
      (/\.java:\d+:\s*error:/.test(stdout) && !/\[\s*\d+\s+tests found\s*\]/i.test(stdout))
    ) {
      const compileError = stdout.split("\n").slice(0, 12).join("\n");
      res.json({
        passed: 0,
        total: 0,
        results: [],
        compileError,
        stdout,
        durationMs,
      });
      return;
    }

    const parsed = parseJUnitOutput(stdout);
    res.json({
      ...parsed,
      durationMs,
      success: code === 0 && parsed.passed === parsed.total && parsed.total > 0,
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Run failed",
      passed: 0,
      total: 0,
      results: [],
    });
  } finally {
    await fs.rm(tmp, { recursive: true, force: true });
  }
});

await loadManifests();
app.listen(PORT, () => {
  const mode = USE_DOCKER ? "docker" : "local-jdk";
  console.log(`[runner] listening on :${PORT} mode=${mode}`);
  if (!USE_DOCKER) {
    console.log(
      "[runner] Using local JDK. Set USE_DOCKER=true only if Docker is installed.",
    );
  }
});
