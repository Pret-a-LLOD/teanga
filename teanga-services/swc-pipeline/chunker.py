# python 3.7
import nltk
import re
import warnings
import os
import sys
import argparse

########
# args #
########

# parser = argparse.ArgumentParser(description='chunker for SWC replication, read CoNLL-U from stdin, requires UPOS or XPOS columns')
# args = parser.parse_args()

#################
# aux functions #
#################

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

####################
# parse conll file #
####################

# stack of parsers
PARSERS=[
    nltk.parse.ShiftReduceParser,                   # lossy, but efficient
    nltk.parse.IncrementalLeftCornerChartParser,    # less lossy, but still somewhat efficient
#   nltk.parse.chart.BottomUpLeftCornerChartParser, #
#   nltk.parse.IncrementalBottomUpChartParser,      # this one gives better partial parses
#   nltk.parse.ChartParser                          #
#   nltk.parse.RecursiveDescentParser               # ran into infinite loop
#   nltk.parse.BllipParser                          # BLLIP/Charniak parser # couldn't import
    ]
parsers={} # created on demand

# top-level node(s) per sentence
TARGETS = ["S"]

TARGETS=list(map(lambda x: nltk.grammar.Nonterminal(x), TARGETS))

def parse(buffer:list, base_grammar=nltk.data.load("delex-chunker.cfg")):
        """ buffer: list of lists, representing one conll-u sentence """

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

# process sentence by sentence
buffer=[]
#base_grammar = nltk.data.load("chunker.cfg")


'''
for line in sys.stdin:
    line=line.strip()
    if line=="":
        if len(buffer)>0:
            print(" ".join([ row[1] for row  in buffer]))
            #print(parse(buffer))
            print()
            buffer=[]
    elif line[0] in "0123456789" and "\t" in line :
        buffer.append(line.split("\t"))
    else:
        #print(line)
        pass
if len(buffer)>0:
    #print(parse(buffer))
    print(" ".join([ row[1] for row  in buffer]))
'''


with open("sample_pos.txt") as inpf:
    for line in inpf:
        line = line.split()
        print(line)
        print(parse(line))
