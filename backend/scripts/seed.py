#!/usr/bin/env python3
"""
Seed script to create test services for development
"""
import os
import sys
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'safehome.settings')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
django.setup()

from services.models import Service

def seed_services():
    """Create sample services for testing"""
    print("Seeding services...")

    # Sample services data
    services_data = [
        {
            'title': 'House Cleaning',
            'description': 'Complete house cleaning service including dusting, vacuuming, and sanitizing all rooms.',
            'price': 150.00,
            'category': 'Cleaning',
            'estimated_duration': 4,
        },
        {
            'title': 'Plumbing Repair',
            'description': 'Professional plumbing repair services for leaks, clogs, and installations.',
            'price': 80.00,
            'category': 'Maintenance',
            'estimated_duration': 2,
        },
        {
            'title': 'Emergency Locksmith',
            'description': '24/7 emergency locksmith services for lockouts and security issues.',
            'price': 120.00,
            'category': 'Emergency',
            'estimated_duration': 1,
        },
        {
            'title': 'Garden Maintenance',
            'description': 'Complete garden care including lawn mowing, weeding, and plant maintenance.',
            'price': 60.00,
            'category': 'Maintenance',
            'estimated_duration': 3,
        },
    ]

    created_count = 0
    for service_data in services_data:
        service, created = Service.objects.get_or_create(
            title=service_data['title'],
            defaults=service_data
        )
        if created:
            created_count += 1
            print(f"Created service: {service.title}")

    print(f"Seed completed. Created {created_count} new services.")

if __name__ == '__main__':
    seed_services()
