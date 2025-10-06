#!/usr/bin/env python3
"""
Simple test script to verify services API functionality
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

import requests

def test_services_api():
    """Test the services API"""
    print("Testing Services API...")

    try:
        response = requests.get('http://localhost:8000/api/services/')
        print(f'Status Code: {response.status_code}')

        if response.status_code == 200:
            services = response.json()
            print(f'Number of services: {len(services)}')

            if len(services) > 0:
                print('Sample services:')
                for service in services[:3]:  # Show first 3
                    print(f'  - {service["title"]}: ${service["price"]} ({service["category"]})')
                    print(f'    Description: {service["description"][:50]}...')
            else:
                print('No services found. Please run the seed script.')
        else:
            print(f'Error response: {response.text}')

    except Exception as e:
        print(f'Connection error: {e}')

if __name__ == '__main__':
    test_services_api()
