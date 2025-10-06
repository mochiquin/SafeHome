#!/usr/bin/env python3
"""
Test script for OpenAPI documentation functionality
"""
import os
import sys
import django
import json
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
django.setup()

from django.test import Client


def test_openapi_schema_endpoint():
    """Test OpenAPI schema endpoint"""
    print("Testing OpenAPI schema endpoint...")

    client = Client()

    # Test schema endpoint
    response = client.get('/api/schema/')

    if response.status_code == 200:
        # Parse JSON response
        try:
            schema_data = json.loads(response.content.decode('utf-8'))

            # Check if schema has basic structure
            if 'openapi' in schema_data and 'info' in schema_data and 'paths' in schema_data:
                print("PASS: OpenAPI schema endpoint returns valid JSON schema")
                print(f"  OpenAPI version: {schema_data.get('openapi', 'unknown')}")
                print(f"  API title: {schema_data.get('info', {}).get('title', 'unknown')}")
                print(f"  Number of paths: {len(schema_data.get('paths', {}))}")

                # Check if we have some expected paths
                paths = schema_data.get('paths', {})
                expected_paths = [
                    '/api/auth/', '/api/services/', '/api/bookings/',
                    '/api/payments/', '/api/covid/'
                ]

                found_paths = 0
                for expected_path in expected_paths:
                    if any(expected_path in path for path in paths.keys()):
                        found_paths += 1

                if found_paths >= 3:  # At least some expected paths
                    print(f"PASS: Schema contains {found_paths} expected API paths")
                    return True
                else:
                    print(f"FAIL: Schema missing expected API paths (found {found_paths})")
                    return False
            else:
                print("FAIL: Schema missing required OpenAPI fields")
                return False

        except json.JSONDecodeError:
            print("FAIL: Schema endpoint did not return valid JSON")
            return False
    else:
        print(f"FAIL: Expected 200, got {response.status_code}")
        print(f"Response: {response.content[:200]}...")
        return False


def test_openapi_docs_endpoint():
    """Test OpenAPI docs (Swagger UI) endpoint"""
    print("\nTesting OpenAPI docs endpoint...")

    client = Client()

    # Test docs endpoint
    response = client.get('/api/docs/')

    if response.status_code == 200:
        # Check if response contains Swagger UI HTML
        content = response.content.decode('utf-8', errors='ignore')

        if 'swagger' in content.lower() and 'ui' in content.lower():
            print("PASS: OpenAPI docs endpoint returns Swagger UI HTML")
            return True
        else:
            print("FAIL: Docs endpoint doesn't contain expected Swagger UI content")
            return False
    else:
        print(f"FAIL: Expected 200, got {response.status_code}")
        return False


def test_api_routes_in_docs():
    """Test that API routes are documented"""
    print("\nTesting API routes in documentation...")

    client = Client()

    # Get schema data
    response = client.get('/api/schema/')

    if response.status_code == 200:
        try:
            schema_data = json.loads(response.content.decode('utf-8'))
            paths = schema_data.get('paths', {})

            # Check for key API endpoints we expect to be documented
            expected_endpoints = [
                '/api/auth/login/',
                '/api/auth/register/',
                '/api/services/',
                '/api/bookings/create/',
                '/api/payments/stripe/checkout/',
                '/api/covid/restriction/',
            ]

            found_endpoints = 0
            for endpoint in expected_endpoints:
                if endpoint in paths:
                    found_endpoints += 1
                    print(f"  Found endpoint: {endpoint}")

            if found_endpoints >= 4:  # At least half of expected endpoints
                print(f"PASS: Found {found_endpoints}/{len(expected_endpoints)} expected API endpoints in docs")
                return True
            else:
                print(f"FAIL: Only found {found_endpoints}/{len(expected_endpoints)} expected endpoints")
                return False

        except json.JSONDecodeError:
            print("FAIL: Could not parse schema JSON")
            return False
    else:
        print(f"FAIL: Could not get schema (status: {response.status_code})")
        return False


def test_openapi_info():
    """Test OpenAPI info section"""
    print("\nTesting OpenAPI info section...")

    client = Client()

    response = client.get('/api/schema/')

    if response.status_code == 200:
        try:
            schema_data = json.loads(response.content.decode('utf-8'))
            info = schema_data.get('info', {})

            # Check required info fields
            required_fields = ['title', 'version']
            missing_fields = []

            for field in required_fields:
                if field not in info:
                    missing_fields.append(field)

            if not missing_fields:
                print("PASS: OpenAPI info contains all required fields")
                print(f"  Title: {info.get('title', 'unknown')}")
                print(f"  Version: {info.get('version', 'unknown')}")
                print(f"  Description: {info.get('description', 'none')}")
                return True
            else:
                print(f"FAIL: Missing required info fields: {missing_fields}")
                return False

        except json.JSONDecodeError:
            print("FAIL: Could not parse schema JSON")
            return False
    else:
        print(f"FAIL: Could not get schema (status: {response.status_code})")
        return False


def run_all_tests():
    """Run all OpenAPI documentation tests"""
    print("Running OpenAPI Documentation Tests...")

    success = True

    # Test 1: Schema endpoint
    success &= test_openapi_schema_endpoint()

    # Test 2: Docs endpoint
    success &= test_openapi_docs_endpoint()

    # Test 3: API routes in docs
    success &= test_api_routes_in_docs()

    # Test 4: OpenAPI info section
    success &= test_openapi_info()

    if success:
        print("\nAll OpenAPI documentation tests passed!")
        print("✅ OpenAPI schema endpoint works correctly")
        print("✅ OpenAPI docs (Swagger UI) endpoint works correctly")
        print("✅ API routes are properly documented")
        print("✅ OpenAPI info section is complete")
        return True
    else:
        print("\nSome OpenAPI documentation tests failed!")
        return False


if __name__ == '__main__':
    success = run_all_tests()
    if not success:
        sys.exit(1)
