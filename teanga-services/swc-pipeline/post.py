import requests
pload = open("sample_pos.txt").read() 
r = requests.post(
        'http://localhost:8082/chunker/',
        data=pload
                 )

print(r.text)
