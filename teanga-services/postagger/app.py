from flask import Flask, request
from itertools import cycle
from random import randint, choice 
from  string import ascii_lowercase
import json 
from collections import namedtuple
import nltk

webserver = Flask("myapp")

@webserver.route("/postagger/<filepath>",methods=["POST"])
def value_generator(filepath):
    #sentences = request.data.decode("utf-8").strip().split("\n")
    with open(filepath) as inpfile:
        sentences = [line.strip() for line in inpfile]
            
    print(sentences)
    pos_sentences = []
    for sentence in sentences:
        sent_pos = [tup[1] for tup in nltk.pos_tag(sentence)]
        pos_sentences.append(sent_pos)
    return json.dumps(pos_sentences)

if __name__ == '__main__':
    webserver.run(host="0.0.0.0",port=8080)
