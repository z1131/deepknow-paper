# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /build

# Copy the entire project
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre
VOLUME /tmp
WORKDIR /app

# Copy the executable jar from the builder stage
# Note: paper-api is the boot module
COPY --from=builder /build/paper-api/target/paper-api-*.jar app.jar

EXPOSE 8002
ENTRYPOINT ["java", "-jar", "app.jar"]
