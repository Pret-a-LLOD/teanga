import requests
pload = open("sample_sentences.txt").read() 
r = requests.post(
        'http://localhost:8081/postagger/',
        data=pload
                 )

print(r.text)
