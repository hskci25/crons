# Production image for Render (Node API + JDK 17 for Java tests)
FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openjdk-17-jdk-headless curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

RUN mkdir -p lib \
  && curl -fsSL -o lib/junit-platform-console-standalone.jar \
    https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/1.10.2/junit-platform-console-standalone-1.10.2.jar

COPY index.js ./
COPY questions ./questions/

ENV NODE_ENV=production
ENV USE_DOCKER=false

EXPOSE 10000

CMD ["node", "index.js"]
