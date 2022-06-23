FROM gradle:7.0.0-jdk8
EXPOSE 8080
USER root

WORKDIR /app
COPY ./ /app
RUN chmod +x /app
COPY ./openapi.yaml /openapi.yaml
RUN gradle build
CMD ["java","-jar","build/libs/rest-service-0.0.1-SNAPSHOT.jar"]
