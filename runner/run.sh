#!/bin/sh
set -e
cd /workspace

JUNIT_JAR=/opt/junit-platform-console-standalone.jar
OUT=/workspace/out
mkdir -p "$OUT"

SOURCES=$(find src -name '*.java' 2>/dev/null | tr '\n' ' ')

if [ -z "$SOURCES" ]; then
  echo "COMPILE_ERROR: No .java files under src/"
  exit 1
fi

javac -encoding UTF-8 -cp "$JUNIT_JAR" -d "$OUT" $SOURCES 2>&1 || {
  echo "COMPILE_ERROR"
  exit 1
}

java -jar "$JUNIT_JAR" execute \
  --class-path "$OUT" \
  --scan-class-path \
  --disable-banner \
  --details tree \
  2>&1
