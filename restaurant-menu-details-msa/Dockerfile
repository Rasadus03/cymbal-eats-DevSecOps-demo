FROM openjdk:21-slim
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} restaurant-details-api.jar

ENTRYPOINT ["java","-jar","/restaurant-details-api.jar"]
EXPOSE 8080/tcp