FROM ubuntu:18.04
USER root
RUN apt-get -y update
RUN apt-get install  -y python3-pip python3-dev
RUN apt-get install -y docker.io

WORKDIR /teanga
ENV AIRFLOW_HOME /teanga
RUN chmod +x /teanga
copy ./requirements.txt /teanga/requirements.txt
copy ./ /teanga
RUN pip3 install -r requirements.txt  --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-1.10.12/constraints-3.7.txt"
RUN airflow initdb
RUN chmod +x /teanga/init.sh
CMD ["./init.sh"]  
