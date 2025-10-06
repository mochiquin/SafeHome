#!/usr/bin/env python3
"""
Test script to verify services API functionality
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

import requests
import json

def test_services_api():
    """Test the services API"""
    print("Testing Services API...")

    # Test 1: Get services list
    print("\nTest 1: Get services list")
    try:
        response = requests.get('http://localhost:8000/api/services/')
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            services = response.json()
            print(f"Number of services: {len(services)}")

            if len(services) > 0:
                print(f"First service: {services[0]['title']} - ${services[0]['price']}")
                print(f"Category: {services[0]['category']}")
                print(f"Description: {services[0]['description'][:50]}...")
            else:
                print("No services found in the database")
                return False
        else:
            print(f"Error: {response.text}")
            return False

    except Exception as e:
        print(f"Error connecting to API: {e}")
        return False

    # Test 2: Get specific service detail
    if len(services) > 0:
        service_id = services[0]['id']
        print(f"\nTest 2: Get service detail for ID: {service_id}")

        try:
            response = requests.get(f'http://localhost:8000/api/services/{service_id}/')
            print(f"Status Code: {response.status_code}")

            if response.status_code == 200:
                service_detail = response.json()
                print(f"Service: {service_detail['title']}")
                print(f"Description: {service_detail['description']}")
                print(f"Category: {service_detail['category']}")
                print(f"Price: ${service_detail['price']}")
                print(f"Active: {service_detail['is_active']}")
            else:
                print(f"Error: {response.text}")
                return False

        except Exception as e:
            print(f"Error getting service detail: {e}")
            return False

    return True

if __name__ == '__main__':
    print("Testing SafeHome Services API...")

    success = test_services_api()

    if success:
        print("\nAll services API tests passed!")
    else:
        print("\nSome tests failed!")
        sys.exit(1)
