import requests
pload = open("sample_sentences.txt").read() 
r = requests.post(
        'http://localhost:8080/postagger/sample_sentences.txt',
        data=pload
                 )

print(r.text)
