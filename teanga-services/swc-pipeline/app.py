from flask import Flask, request
from itertools import cycle
from random import randint, choice 
from  string import ascii_lowercase
import json 
from collections import namedtuple
import nltk
import re
import warnings
import os
import sys
import argparse

webserver = Flask("myapp")
def init_parser(PARSER, grammar):
    """
    return an object of PARSER class, suppress warnings written to stdout
    """
    with open(os.devnull, "w") as devnull:
        old_stdout = sys.stdout
        sys.stdout = devnull
        try:
            parser=PARSER(grammar)
        finally:
            sys.stdout = old_stdout
    return parser

def flatten_tree(tree):
    """
    eliminate recurrent nonterminals (note that this is very different from nltk.Tree.flatten()
    """
#   print("flatten_tree(",tree,")")
    if(len(tree.leaves())<=1):
        return tree
    children=None
    if(len(tree)>0):
        children=[]
        for x in range(len(tree)):
            child=flatten_tree(tree[x])
            if(child.label()==tree.label() and len(child)>0):
                for y in range(len(child)):
                    children.append(child[y])
            else:
                children.append(child)

    return nltk.Tree(tree.label(), children)


def parse(buffer:list, base_grammar=nltk.data.load("delex-chunker.cfg")):
        """ buffer: list of lists, representing one conll-u sentence """
        PARSERS=[
        nltk.parse.ShiftReduceParser,                   # lossy, but efficient
        nltk.parse.IncrementalLeftCornerChartParser,    # less lossy, but still somewhat efficient
        ]
        parsers={} # created on demand

        TARGETS = ["S"]

        TARGETS=list(map(lambda x: nltk.grammar.Nonterminal(x), TARGETS))

        # base vocab
        #s = [ row[3] for row in buffer ]
        s = buffer

        # UPOS => tagger rules
        grammar_additions=[]
        '''for word,upos in [ (row[1], row[3]) for row in buffer ]:
                grammar_additions.append(upos+' -> "'+word+'"')
        grammar_additions=sorted(set(grammar_additions))'''

        grammar=base_grammar            # with every text, we forget what we learned from earlier annotations

        # add to grammar (note that we change the overall grammar!)
        if len(grammar_additions)>0:
                tmp="# "+str(grammar)+"\n"+("\n".join(grammar_additions))
                # initial # is required to comment out the first line about the start symbol
                grammar=nltk.grammar.CFG.fromstring(tmp)

        parsers={}
        parse=None
        for PARSER in PARSERS:
                if(parse==None):
                        if(not PARSER in parsers):
                                parsers[PARSER]=init_parser(PARSER, grammar)
                                parser=parsers[PARSER]
                                for start in TARGETS:
                                        if(parse==None):
                                                parser.grammar()._start = start
                                                parse=parser.parse_one(s)
                                                if(parse):
                                                        parse=flatten_tree(parse)
        if(parse==None):        # shouldn't happen
                parse="(FRAG\n"
                for row in buffer:
                        parse+="  ("+row[3]+" "+row[1]+")\n"
                parse+=")"
                print(parse)

        print("",end="\n",flush=True)

        return str(parse)

@webserver.route("/chunker/",methods=["POST"])
def value_generator():
    parsed_sentences = []
    with open("sample_pos.txt") as inpf:
        for line in inpf:
            line = line.split()
            parsed = parse(line)
            print(parsed)
            parsed_sentences.append(parsed)

    return json.dumps(parsed_sentences)

webserver.run(host="0.0.0.0",port=8082)
