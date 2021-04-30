FROM ubuntu:latest
EXPOSE 8080
USER root
RUN apt-get update
RUN apt-get install -y python-dev build-essential
RUN apt-get install -y python3-pip python3-dev

WORKDIR /app
COPY ./ /app
RUN chmod +x /app
RUN pip3 install -r /app/requirements.txt
COPY ./openapi.yaml /openapi.yaml
CMD ["python3","app.py"]
