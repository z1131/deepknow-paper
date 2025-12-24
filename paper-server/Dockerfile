# Stage 1: Build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
# 仅构建启动模块 paper-interface 及其依赖
RUN mvn clean package -DskipTests -pl paper-interface -am

# Stage 2: Run
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/paper-interface/target/*.jar app.jar
ENV TZ=Asia/Shanghai
EXPOSE 8002 20882
ENTRYPOINT ["java", "-jar", "app.jar"]
