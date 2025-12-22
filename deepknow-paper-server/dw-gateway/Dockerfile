FROM eclipse-temurin:21-jre
VOLUME /tmp
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "app.jar"]
