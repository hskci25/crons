FROM eclipse-temurin:17-jdk-alpine

RUN apk add --no-cache curl \
  && curl -fsSL -o /opt/junit-platform-console-standalone.jar \
    https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/1.10.2/junit-platform-console-standalone-1.10.2.jar

COPY run.sh /run.sh
RUN chmod +x /run.sh

WORKDIR /workspace
ENTRYPOINT ["/run.sh"]
