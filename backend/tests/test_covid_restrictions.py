#!/usr/bin/env python3
"""
Test script for COVID restriction API functionality
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

from django.test import Client
from covid.views import CovidRestrictionService


def test_covid_restriction_service():
    """Test COVID restriction service logic"""
    print("Testing COVID restriction service logic...")

    # Test known cities
    test_cases = [
        # Australia
        ('AU', 'SA', 'Adelaide', 'low'),
        ('AU', 'NSW', 'Sydney', 'high'),
        ('AU', 'VIC', 'Melbourne', 'high'),
        ('AU', 'QLD', 'Brisbane', 'medium'),
        ('AU', 'WA', 'Perth', 'low'),

        # United States
        ('US', 'CA', 'Los Angeles', 'high'),
        ('US', 'NY', 'New York', 'high'),
        ('US', 'TX', 'Houston', 'medium'),
        ('US', 'FL', 'Miami', 'high'),
        ('US', 'IL', 'Chicago', 'medium'),

        # Canada
        ('CA', 'ON', 'Toronto', 'medium'),
        ('CA', 'BC', 'Vancouver', 'medium'),
        ('CA', 'QC', 'Montreal', 'high'),
        ('CA', 'AB', 'Calgary', 'medium'),

        # United Kingdom
        ('GB', 'ENG', 'London', 'high'),
        ('GB', 'SCT', 'Edinburgh', 'medium'),
        ('GB', 'WLS', 'Cardiff', 'medium'),
    ]

    for country, state, city, expected_level in test_cases:
        result = CovidRestrictionService.get_restriction_level(country, state, city)
        if result == expected_level:
            print(f"  PASS: {country}/{state}/{city} -> {result}")
        else:
            print(f"  FAIL: {country}/{state}/{city} -> Expected: {expected_level}, Got: {result}")
            return False

    return True


def test_unknown_locations():
    """Test unknown locations return 'unknown'"""
    print("\nTesting unknown locations...")

    unknown_cases = [
        ('AU', 'SA', 'UnknownCity'),  # Unknown city in known state
        ('AU', 'UnknownState', 'Adelaide'),  # Unknown state in known country
        ('UnknownCountry', 'SA', 'Adelaide'),  # Unknown country
        ('US', None, None),  # Country only (should be unknown for US)
        ('AU', 'SA', None),  # Country and state only
        (None, None, None),  # No parameters
    ]

    for country, state, city in unknown_cases:
        result = CovidRestrictionService.get_restriction_level(country, state, city)
        if result == 'unknown':
            print(f"  PASS: {country or 'None'}/{state or 'None'}/{city or 'None'} -> unknown")
        else:
            print(f"  FAIL: {country or 'None'}/{state or 'None'}/{city or 'None'} -> Expected: unknown, Got: {result}")
            return False

    return True


def test_api_endpoint():
    """Test COVID restriction API endpoint"""
    print("\nTesting COVID restriction API endpoint...")

    client = Client()

    # Test 1: Known city
    response = client.get('/api/covid/restriction/', {'country': 'AU', 'state': 'SA', 'city': 'Adelaide'})

    if response.status_code == 200:
        data = response.json()
        if data.get('restriction_level') == 'low':
            print("  PASS: Known city returns correct restriction level")
        else:
            print(f"  FAIL: Expected 'low', got {data.get('restriction_level')}")
            return False
    else:
        print(f"  FAIL: Expected 200, got {response.status_code}")
        print(f"  Response: {response.content}")
        return False

    # Test 2: Unknown city
    response = client.get('/api/covid/restriction/', {'country': 'AU', 'state': 'SA', 'city': 'UnknownCity'})

    if response.status_code == 200:
        data = response.json()
        if data.get('restriction_level') == 'unknown':
            print("  PASS: Unknown city returns 'unknown'")
        else:
            print(f"  FAIL: Expected 'unknown', got {data.get('restriction_level')}")
            return False
    else:
        print(f"  FAIL: Expected 200, got {response.status_code}")
        return False

    # Test 3: Missing country parameter
    response = client.get('/api/covid/restriction/', {'state': 'SA', 'city': 'Adelaide'})

    if response.status_code == 400:
        error_data = response.json()
        if 'Country parameter is required' in error_data.get('error', ''):
            print("  PASS: Missing country parameter correctly rejected")
        else:
            print("  FAIL: Wrong error message for missing country")
            return False
    else:
        print(f"  FAIL: Expected 400, got {response.status_code}")
        return False

    # Test 4: Case insensitive city names
    response = client.get('/api/covid/restriction/', {'country': 'AU', 'state': 'SA', 'city': 'adelaide'})

    if response.status_code == 200:
        data = response.json()
        if data.get('restriction_level') == 'low':
            print("  PASS: Case insensitive city name works")
        else:
            print(f"  FAIL: Expected 'low', got {data.get('restriction_level')}")
            return False
    else:
        print(f"  FAIL: Expected 200, got {response.status_code}")
        return False

    return True


def test_country_level_restrictions():
    """Test country-level restriction defaults"""
    print("\nTesting country-level restrictions...")

    # Test country only (should return unknown for countries requiring state info)
    country_cases = [
        ('AU', 'unknown'),  # Australia requires state info
        ('US', 'unknown'),  # US requires state info
        ('GB', 'unknown'),  # UK requires state info
    ]

    for country, expected_level in country_cases:
        result = CovidRestrictionService.get_restriction_level(country)
        if result == expected_level:
            print(f"  PASS: {country} country level -> {result}")
        else:
            print(f"  FAIL: {country} country level -> Expected: {expected_level}, Got: {result}")
            return False

    return True


def run_all_tests():
    """Run all COVID restriction tests"""
    print("Running COVID Restriction Tests...")

    success = True

    # Test 1: Service logic
    success &= test_covid_restriction_service()

    # Test 2: Unknown locations
    success &= test_unknown_locations()

    # Test 3: API endpoint
    success &= test_api_endpoint()

    # Test 4: Country level restrictions
    success &= test_country_level_restrictions()

    if success:
        print("\nAll COVID restriction tests passed!")
        print("✅ COVID restriction lookup works correctly")
        print("✅ Known cities return correct restriction levels")
        print("✅ Unknown locations return 'unknown'")
        print("✅ API endpoint handles all cases properly")
        return True
    else:
        print("\nSome COVID restriction tests failed!")
        return False


if __name__ == '__main__':
    success = run_all_tests()
    if not success:
        sys.exit(1)
