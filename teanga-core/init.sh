#!/bin/sh
cp -r /teanga/teanga-ui/www/app.py /usr/local/lib/python3.6/dist-packages/airflow/www/
cp -r /teanga/teanga-ui/www/views.py /usr/local/lib/python3.6/dist-packages/airflow/www/
cp -r /teanga/teanga-ui/www/templates/admin /usr/local/lib/python3.6/dist-packages/airflow/www/templates
cp -r /teanga/teanga-ui/www/templates/airflow /usr/local/lib/python3.6/dist-packages/airflow/www/templates
cp -r /teanga/teanga-ui/www/templates/teanga /usr/local/lib/python3.6/dist-packages/airflow/www/templates
cp -r /teanga/teanga-ui/www/static/public /usr/local/lib/python3.6/dist-packages/airflow/www/static
cp -r /teanga/teanga-ui/www/static/react /usr/local/lib/python3.6/dist-packages/airflow/www/static
cp -r /teanga/teanga-ui/www/static/react/images /usr/local/lib/python3.6/dist-packages/airflow/www/static
rm /teanga/workflows/ttt*
rm /teanga/workflows/*.pickle
rm /teanga/dags/ttt*
service docker start &
airflow webserver &
airflow scheduler 
