FROM ubuntu:18.04
EXPOSE 8080
USER root
RUN apt-get update
RUN apt-get install -y python-dev build-essential
RUN apt-get install -y python3-pip python3-dev

WORKDIR /app
COPY ./ /app
RUN chmod +x /app
RUN pip3 install -r /app/requirements.txt
RUN python3 -m nltk.downloader punkt
RUN python3 -m nltk.downloader averaged_perceptron_tagger 
COPY ./openapi.yaml /openapi.yaml
CMD ["python3","app.py"]
