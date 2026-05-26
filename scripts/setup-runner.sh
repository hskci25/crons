#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
JAR="$ROOT/runner/lib/junit-platform-console-standalone.jar"
mkdir -p "$ROOT/runner/lib"
if [ ! -f "$JAR" ]; then
  curl -fsSL -o "$JAR" \
    https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/1.10.2/junit-platform-console-standalone-1.10.2.jar
  echo "Downloaded JUnit jar."
fi
cd "$ROOT/runner" && npm install
echo "Runner ready. Use: npm run runner:dev (requires JDK 17+ or Docker)"
