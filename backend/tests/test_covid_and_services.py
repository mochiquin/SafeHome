"""
Tests for the COVID restriction lookup and the public services catalogue.
"""
from decimal import Decimal

import pytest

from covid.views import CovidRestrictionService
from services.models import Service


@pytest.mark.parametrize('country, state, city, expected', [
    ('AU', 'SA', 'Adelaide', 'low'),
    ('AU', 'NSW', 'Sydney', 'high'),
    ('AU', 'QLD', 'Brisbane', 'medium'),
    ('US', 'NY', 'New York', 'high'),
    ('CA', 'ON', 'Toronto', 'medium'),
    ('GB', 'SCT', 'Edinburgh', 'medium'),
])
def test_known_locations(country, state, city, expected):
    assert CovidRestrictionService.get_restriction_level(country, state, city) == expected


def test_input_is_normalised():
    assert CovidRestrictionService.get_restriction_level('au', 'sa', '  adelaide/ ') == 'low'


def test_city_without_state_is_found():
    assert CovidRestrictionService.get_restriction_level('AU', None, 'Adelaide') == 'low'


@pytest.mark.parametrize('country, state, city', [
    ('AU', 'SA', 'Atlantis'),
    ('AU', 'XX', 'Adelaide'),
    ('ZZ', 'SA', 'Adelaide'),
    ('US', None, None),
    (None, None, None),
])
def test_unknown_locations(country, state, city):
    assert CovidRestrictionService.get_restriction_level(country, state, city) == 'unknown'


def test_state_only_returns_most_common_level():
    level = CovidRestrictionService.get_restriction_level('AU', 'SA')
    assert level in {'low', 'medium', 'high'}


class TestCovidApi:
    URL = '/api/covid/restriction/'

    def test_lookup_is_public(self, api_client):
        response = api_client.get(self.URL, {'country': 'AU', 'state': 'SA', 'city': 'Adelaide'})

        assert response.status_code == 200
        assert response.data['data']['restriction_level'] == 'low'

    def test_country_is_required(self, api_client):
        assert api_client.get(self.URL).status_code == 400


class TestServicesApi:
    def _service(self, **overrides):
        fields = {
            'title': 'Deep clean',
            'description': 'Whole-house clean',
            'price': Decimal('99.00'),
            'category': 'cleaning',
            'estimated_duration': 3,
        }
        fields.update(overrides)
        return Service.objects.create(**fields)

    def test_list_is_public_and_hides_inactive(self, api_client):
        active = self._service()
        self._service(title='Retired service', is_active=False)

        response = api_client.get('/api/services/')

        assert response.status_code == 200
        items = response.data['data'] if isinstance(response.data, dict) else response.data
        assert [item['title'] for item in items] == [active.title]

    def test_inactive_service_detail_is_404(self, api_client):
        inactive = self._service(is_active=False)

        assert api_client.get(f'/api/services/{inactive.id}/').status_code == 404
