import requests
import json

# Test services API
print('Testing services API...')
response = requests.get('http://localhost:8000/api/services/')
print(f'Status Code: {response.status_code}')

if response.status_code == 200:
    services = response.json()
    print(f'Number of services: {len(services)}')
    print('Services:')
    for service in services:
        print(f'  - {service["title"]}: ${service["price"]} ({service["category"]})')
else:
    print(f'Error: {response.text}')
