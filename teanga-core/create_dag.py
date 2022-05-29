from jinja2 import Template
import sys
import os
workflow_filepath=sys.argv[1]
workflow_filename=workflow_filepath.split(os.sep)[-1]
dag_filename=workflow_filename.replace(".json",".py")
with open("./dags_generator/dag_template") as file_:
    template = Template(file_.read())
rendered=template.render(workflow_filepath=workflow_filepath)
with open(f"./dags/{dag_filename}", "w") as outf:
    outf.write(rendered)
