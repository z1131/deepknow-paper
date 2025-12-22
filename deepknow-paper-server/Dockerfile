# Build Stage
FROM maven:3.9.6-eclipse-temurin-21 as builder
WORKDIR /app
COPY pom.xml .
COPY dw-common dw-common
COPY dw-api dw-api
COPY dw-core dw-core
COPY dw-auth dw-auth
COPY dw-gateway dw-gateway
# Skip tests for faster build in this context
RUN mvn clean package -DskipTests

# Run Stage - We need separate images for each service, or one image with entrypoint script
# For simplicity/monolith-style in one repo, we can use a multi-stage approach or arg.
# But standard Spring Cloud usually implies separate containers.
# GoodTalk reference: It seems goodtalk-server might be a single spring boot app or they build one image?
# Inspecting goodtalk's deploy.yml: "context: ." implies one image.
# If deepknow-paper-server is multiple modules, we usually build one image PER module.
# However, for "Phase 1: let it run", we likely need at least GATEWAY and maybe CORE/AUTH.
# Let's assume user wants to run the whole stack.
# Creating a Dockerfile that defaults to running dw-gateway or allowing overriding via ENV.

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/dw-gateway/target/*.jar app-gateway.jar
COPY --from=builder /app/dw-auth/target/*.jar app-auth.jar
COPY --from=builder /app/dw-core/target/*.jar app-core.jar

# Configuration for Nacos is handled via bootstrap.yml + ENV vars.
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Entrypoint script to choose which service to start
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
