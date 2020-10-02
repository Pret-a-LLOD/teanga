.. Tutorial on Documentation using Sphinx documentation master file, created by
   sphinx-quickstart on Sun Jun 17 16:23:30 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.


Teanga Documentation
*************************************
About
===========
Teanga is a command-line tool that automates and facilitates the creation of NLP workflows using Airflow, OpenAPI specification and docker

Quick Start
================================
1. Installing Teanga
    If you have wget command installed in your terminal::

        wget -O - https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/CLI/install.sh | sudo bash

    If you have curl command installed in your terminal::

        curl https://raw.githubusercontent.com/Pret-a-LLOD/teanga/master/CLI/install.sh | sudo bash

2. Run Workflow::

    teanga run workflow -f ./workflows/naisc_local_workflow.json -p 8080


Available Commands 
================================
1. teanga workflow run
    A. execute a workflow specification

Setup procedure
================
1. Configure project environment (Either A. Install Pycharm OR B. Create a Virtual Environment)
    A. Install Pycharm (www.jetbrains.com/pycharm/download/)
        - Open the Teacher API Directory (File -> Open)
        - Configure the Base Project Interpreter (File -> Settings -> Project Interpreter)
            * Base Project Interpreter: pyenv version 3.6.2 ('path to .pyenv version 3.6.2'/bin/python)
                (pyenv was installed before creating the new project through 'pyenv install 3.6.3')
            .. note:: In my case, when I tried to use the suggested base interpreter set by Pycharm, installing packages only appeared to be successful according to the response message, but the packages do not appear in the package list and modules imported from them do not get resolved. Thus, I resorted to the pyenv.
        - Manually install packages to project interpreter (Pycharm -> Preferences -> Project -> Project Interpreter -> plus button on the lower left side of the package table) and apply changes OR type the command below on the activated virtual environment. ::

            pip install -r requirements.txt

    B. Create a Python Virtual Environment
        - Install virtualenv::

            sudo pip install virtualenv

        - Create virtialenv::

            virtualenv -p python3 <name of virtualenv>

        - Install requirements::

            pip install -r requirements.txt

2. Install MySQL
    A. Search on the web on how to install MySQL in your OS
    B. Create database through piping
            mysql -u root < <Path to file>/create_db.sql
         * NOTE: depending on your mysql config, you need to provide your password if you have one
3. Initialize and Populate Company Database
    A. Edit line 14 of teacherAPI/database.py and use the correct url to your mysql
        * In my case, I'm using the root and has a password of 'password'
        'mysql://root:<password>@localhost/Teacher'
    B. Either run the line below
        $ sh database_populator.sh

        OR

    C. Use the python interactive shell and run the lines below::

        $ python
        >> from teacherAPI.database import init_db;
        >> init_db();
        >> from teacherAPI.populate import populate;
        >> populate()

4. Run app.py::

    python app.py

5. Refer to TeacherAPI controller on how to test the code through curl

Endpoints of the Teacher API
============================
1. Insert a new teacher record
2. Update an existing teacher record
3. Delete teacher record
4. Get teacher record details
5. List all teacher records
6. Filter list of teachers using wildcard search


Documentation for the Code
**************************
.. toctree::
   :maxdepth: 2
   :caption: Contents:

TeacherAPI main
===================
.. automodule:: app
   :members:

TeacherAPI controller
=====================
.. automodule:: teacherAPI.controller
   :members:

TeacherAPI models
=================
.. automodule:: teacherAPI.models
   :members:

TeacherAPI database
===================
.. automodule:: teacherAPI.database
   :members:

TeacherAPI populate
===================
.. automodule:: teacherAPI.populate
   :members:


Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
