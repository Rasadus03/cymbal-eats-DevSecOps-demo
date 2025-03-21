FROM openjdk:21-slim
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} restaurantsapi.jar

ENTRYPOINT ["java","-jar","/restaurantsapi.jar"]
EXPOSE 8080/tcp