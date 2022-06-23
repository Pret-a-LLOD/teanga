# SWC replication workflow

## Idea

idea: use Teanga to replicate an existing workflow of the SWC system

steps:
input: plain text
- POS annotation (Stanford POS; incl. POS)
- chunking (suggestion: NLTK CFG grammar), non-recursive
output: annotated text

further workflow:
- (calculate embeddings) [we don't replicate that]
- [modelling the result as a term base with embeddings -- no code, just data modelling with OntoLex-FrAC, part of WP5]
- English (for the moment)

TODO@NUIG:
- Teanga wrapper around Stanford (or another PTB tagger -- already in DKPro?)
- Teanga wrapper around NLTK (parser)

TODO@GUF:
- CFG grammar for chunking with NLTK

## Chunking

Input is a CoNLL-U file, we use UPOS (column 4) information only.

- Grammar: [`chunker.cfg`](chunker.cfg): can run directly with NLTK parsers
- Parser: [`chunker.py`](chunker.py): calls NLTK and eliminates recursive nodes
- command line use:

    $> cat sample.conllu | python3 chunker.py

- This produces one possible parse, not necessarily the only one
- Relevant output nodes are `CHUNK`, ignore everything else. We create one `CHUNK` for every nominal, inclusion of adjectives is optional.

Output:

    (S
      (OTHER (ADP In))
      (OTHER (ADJ natural))
      (CHUNK (NOMINAL (NOUN language) (NOUN processing)))
      (OTHER (PUNCT ,))
      (CHUNK (NOMINAL (NOUN linguistics)))
      (OTHER (PUNCT ,))
      (OTHER (CCONJ and))
      (OTHER (VERB neighboring))
      (CHUNK (NOMINAL (NOUN fields)))
      (OTHER (PUNCT ,))
      (CHUNK
        (NOMINAL
          (PROPN Linguistic)
          (PROPN Linked)
          (PROPN Open)
          (PROPN Data)))
      (OTHER (PUNCT ())
      (CHUNK (NOMINAL (PROPN LLOD)))
      (OTHER (PUNCT )))
      (OTHER (VERB describes))
      (OTHER (DET a))
      (CHUNK (NOMINAL (NOUN method)))
      (OTHER (CCONJ and))
      (OTHER (DET an))
      (OTHER (ADJ interdisciplinary))
      (CHUNK (NOMINAL (NOUN community)))
      (OTHER (ADJ concerned))
      (OTHER (SCONJ with))
      (OTHER (VERB creating))
      (OTHER (PUNCT ,))
      (OTHER (VERB sharing))
      (OTHER (PUNCT ,))
      (OTHER (CCONJ and))
      (OTHER (PUNCT ())
      (OTHER (SYM re-))
      (OTHER (PUNCT )))
      (OTHER (VERB using))
      (CHUNK (NOMINAL (NOUN language) (NOUN resources)))
      (OTHER (ADP in))
      (CHUNK (NOMINAL (NOUN accordance)))
      (OTHER (SCONJ with))
      (CHUNK (NOMINAL (PROPN Linked) (PROPN Data) (NOUN principles)))
      (OTHER (PUNCT .)))


    (S
      (OTHER (DET The))
      (CHUNK
        (NOMINAL
          (PROPN Linguistic)
          (PROPN Linked)
          (PROPN Open)
          (PROPN Data)
          (PROPN Cloud)))
      (OTHER (AUX was))
      (OTHER (VERB conceived))
      (OTHER (CCONJ and))
      (OTHER (AUX is))
      (OTHER (AUX being))
      (OTHER (VERB maintained))
      (OTHER (ADP by))
      (OTHER (DET the))
      (CHUNK (NOMINAL (PROPN Open) (PROPN Linguistics)))
      (OTHER (VERB Working))
      (CHUNK (NOMINAL (PROPN Group)))
      (OTHER (PUNCT ())
      (CHUNK (NOMINAL (PROPN OWLG)))
      (OTHER (PUNCT )))
      (OTHER (ADP of))
      (OTHER (DET the))
      (CHUNK (NOMINAL (PROPN Open) (PROPN Knowledge) (PROPN Foundation)))
      (OTHER (PUNCT ,))
      (OTHER (CCONJ but))
      (OTHER (AUX has))
      (OTHER (AUX been))
      (OTHER (DET a))
      (CHUNK (NOMINAL (NOUN point)))
      (OTHER (ADP of))
      (OTHER (ADJ focal))
      (CHUNK (NOMINAL (NOUN activity)))
      (OTHER (ADP for))
      (OTHER (ADJ several))
      (CHUNK (NOMINAL (NOUN W3C) (NOUN community) (NOUN groups)))
      (OTHER (PUNCT ,))
      (CHUNK (NOMINAL (NOUN research) (NOUN projects)))
      (OTHER (PUNCT ,))
      (OTHER (CCONJ and))
      (OTHER (ADJ infrastructure))
      (CHUNK (NOMINAL (NOUN efforts)))
      (OTHER (ADP since))
      (OTHER (ADV then))
      (OTHER (PUNCT .)))
