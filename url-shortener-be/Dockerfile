# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17-slim AS build

WORKDIR /app
COPY . /app

# Run Maven to build the app
RUN mvn clean install -DskipTests

# Stage 2: Create the final image
FROM openjdk:17

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/url-shortener-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
