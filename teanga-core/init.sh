#!/bin/sh
cp -r /teanga/teanga-ui/www/app.py /usr/local/lib/python3.6/dist-packages/airflow/www/
cp -r /teanga/teanga-ui/www/views.py /usr/local/lib/python3.6/dist-packages/airflow/www/
cp -r /teanga/teanga-ui/www/templates/teanga /usr/local/lib/python3.6/dist-packages/airflow/www/templates
cp -r /teanga/teanga-ui/www/static/public /usr/local/lib/python3.6/dist-packages/airflow/www/static
service docker start &
airflow webserver &
airflow scheduler 
