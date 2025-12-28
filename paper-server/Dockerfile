# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# 仅构建启动模块 paper-interface 及其依赖
RUN mvn clean package -DskipTests -pl paper-interface -am

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/paper-interface/target/*.jar app.jar
ENV TZ=Asia/Shanghai
EXPOSE 8002 20882
# Force deployment trigger
ENTRYPOINT ["java", "-jar", "app.jar"]
