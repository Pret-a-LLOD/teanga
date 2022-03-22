from flask import Flask, request, jsonify
from itertools import cycle
from random import randint, choice 
from  string import ascii_lowercase
import json 
from collections import namedtuple
from nltk.tokenize import word_tokenize
import nltk


import flask
from webargs import fields
from flask_apispec import use_kwargs, marshal_with
from flask_apispec import FlaskApiSpec

#from .models import Pet
#from .schemas import PetSchema

webserver = Flask(__name__)
docs = FlaskApiSpec(webserver)

@webserver.route('/sentences_tagger',methods=["POST"])
@use_kwargs({'sentences': fields.List(fields.Str()) })
@marshal_with(None, code=200)
def sentences_pos_tagger(**kwargs):
#   '''
#        ID (token number in sentence)
#        WORD (string form)
#        LEMMA (or _)
#        UPOSTAG (POS, e.g., NOUN -- if the tagset doesn't have NOUN, then _)
#        XPOSTAG (POS, e.g., NN or NNS for common nouns; if not available, _)
#        FEATS (here: _)
#        HEAD (here: _)
#        EDGE (here: _)
#        DEPS (here: _)
#        MISC (here: _)
#   '''
    sentences_data = []
    idx_count = 0
    for (sent_idx, sentence) in enumerate(kwargs['sentences']):
        tokens = word_tokenize(sentence) 
        sentence_data = []
        for (token_idx, (token, tag)) in enumerate(nltk.pos_tag(tokens)):
            lemma = "_"
            upostag = tag
            xpostag = "_"
            feats = "_"
            head = "_"
            edge = "_"
            deps = "_"
            misc = "_"
            formatted_output = \
                    f'{token_idx}\t{token}\t{lemma}\t{upostag}\t{xpostag}\t{feats}\t{head}\t{edge}\t{deps}\t{misc}'
            sentence_data.append(formatted_output)
        if sentence_data:
            sentences_data.append("\n".join(sentence_data)+"\n")
    return jsonify("\n".join(sentences_data))

docs.register(sentences_pos_tagger)

if __name__ == '__main__':
    webserver.run(host="0.0.0.0",debug=True,port=8080)
