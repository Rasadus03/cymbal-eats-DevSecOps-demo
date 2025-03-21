FROM openjdk:21-slim
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} order-mgmt-api.jar

ENTRYPOINT ["java","-jar","/order-mgmt-api.jar"]
EXPOSE 8080/tcp