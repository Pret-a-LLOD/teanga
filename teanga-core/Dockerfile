FROM ubuntu:18.04
USER root
RUN apt-get -y update \
    && apt-get install  -y python3-pip python3-dev \
    && apt-get install -y docker.io \
    && apt-get install -y vim

WORKDIR /teanga
ENV AIRFLOW_HOME /teanga
RUN chmod +x /teanga
COPY ./requirements.txt /teanga/requirements.txt
COPY ./ /teanga
RUN pip3 install -r requirements.txt --no-cache-dir --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-1.10.12/constraints-3.7.txt"
RUN airflow initdb
RUN chmod +x /teanga/init.sh
#CMD ["./init.sh"]  
