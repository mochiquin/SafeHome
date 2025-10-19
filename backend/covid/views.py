"""
COVID restriction views for SafeHome
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from core import success_response, error_response


class CovidRestrictionService:
    """Service for COVID restriction lookups"""

    # Mock data for COVID restrictions
    RESTRICTION_DATA = {
        # Australia
        'AU': {
            'SA': {  # South Australia
                'Adelaide': 'low',
                'Mount Gambier': 'medium',
                'Port Augusta': 'low',
                'Whyalla': 'medium',
            },
            'NSW': {  # New South Wales
                'Sydney': 'high',
                'Newcastle': 'medium',
                'Wollongong': 'medium',
                'Central Coast': 'low',
            },
            'VIC': {  # Victoria
                'Melbourne': 'high',
                'Parkville': 'high',
                'Geelong': 'medium',
                'Ballarat': 'low',
                'Bendigo': 'low',
            },
            'QLD': {  # Queensland
                'Brisbane': 'medium',
                'Gold Coast': 'medium',
                'Cairns': 'low',
                'Townsville': 'low',
            },
            'WA': {  # Western Australia
                'Perth': 'low',
                'Fremantle': 'low',
                'Bunbury': 'low',
                'Geraldton': 'low',
            },
            'TAS': {  # Tasmania
                'Hobart': 'low',
                'Launceston': 'low',
                'Devonport': 'low',
                'Burnie': 'low',
            },
            'NT': {  # Northern Territory
                'Darwin': 'medium',
                'Alice Springs': 'low',
                'Katherine': 'low',
                'Tennant Creek': 'low',
            },
            'ACT': {  # Australian Capital Territory
                'Canberra': 'medium',
                'Queanbeyan': 'medium',
            }
        },
        # United States
        'US': {
            'CA': {  # California
                'Los Angeles': 'high',
                'San Francisco': 'high',
                'San Diego': 'medium',
                'Sacramento': 'medium',
                'San Jose': 'medium',
            },
            'NY': {  # New York
                'New York': 'high',
                'Buffalo': 'medium',
                'Rochester': 'medium',
                'Yonkers': 'medium',
                'Syracuse': 'low',
            },
            'TX': {  # Texas
                'Houston': 'medium',
                'Dallas': 'medium',
                'Austin': 'medium',
                'San Antonio': 'medium',
                'Fort Worth': 'low',
            },
            'FL': {  # Florida
                'Miami': 'high',
                'Orlando': 'medium',
                'Tampa': 'medium',
                'Jacksonville': 'medium',
                'St. Petersburg': 'medium',
            },
            'IL': {  # Illinois
                'Chicago': 'medium',
                'Aurora': 'low',
                'Naperville': 'low',
                'Joliet': 'low',
                'Rockford': 'low',
            }
        },
        # Canada
        'CA': {
            'ON': {  # Ontario
                'Toronto': 'medium',
                'Ottawa': 'medium',
                'Hamilton': 'low',
                'London': 'low',
                'Kitchener': 'low',
            },
            'BC': {  # British Columbia
                'Vancouver': 'medium',
                'Victoria': 'medium',
                'Surrey': 'low',
                'Burnaby': 'low',
                'Richmond': 'low',
            },
            'QC': {  # Quebec
                'Montreal': 'high',
                'Quebec City': 'medium',
                'Laval': 'medium',
                'Gatineau': 'low',
                'Longueuil': 'low',
            },
            'AB': {  # Alberta
                'Calgary': 'medium',
                'Edmonton': 'medium',
                'Red Deer': 'low',
                'Lethbridge': 'low',
                'Medicine Hat': 'low',
            },
            'MB': {  # Manitoba
                'Winnipeg': 'low',
                'Brandon': 'low',
                'Steinbach': 'low',
                'Portage la Prairie': 'low',
            }
        },
        # United Kingdom
        'GB': {
            'ENG': {  # England
                'London': 'high',
                'Manchester': 'medium',
                'Birmingham': 'medium',
                'Leeds': 'medium',
                'Liverpool': 'medium',
                'Newcastle': 'low',
                'Sheffield': 'medium',
                'Bristol': 'medium',
                'Leicester': 'medium',
                'Coventry': 'low',
            },
            'SCT': {  # Scotland
                'Edinburgh': 'medium',
                'Glasgow': 'medium',
                'Aberdeen': 'low',
                'Dundee': 'low',
                'Inverness': 'low',
            },
            'WLS': {  # Wales
                'Cardiff': 'medium',
                'Swansea': 'medium',
                'Newport': 'low',
                'Wrexham': 'low',
                'Bangor': 'low',
            },
            'NIR': {  # Northern Ireland
                'Belfast': 'medium',
                'Derry': 'low',
                'Lisburn': 'low',
                'Newtownabbey': 'low',
            }
        }
    }

    @classmethod
    def get_restriction_level(cls, country: str, state: str = None, city: str = None) -> str:
        """
        Get COVID restriction level for a location
        
        Args:
            country: Country code (e.g., 'AU', 'US', 'CA', 'GB')
            state: State/province code (optional)
            city: City name (optional)
            
        Returns:
            Restriction level: 'high', 'medium', 'low', or 'unknown'
        """
        # Normalize inputs
        country = country.upper() if country else None
        state = state.upper() if state else None
        # Clean city name: strip whitespace, remove trailing slashes, then convert to title case
        if city:
            # Remove all trailing slashes and spaces
            city = city.strip().rstrip('/ ').strip().lower().title()
            if not city:  # If empty after cleaning
                city = None
        else:
            city = None

        # Check if country exists
        if country not in cls.RESTRICTION_DATA:
            return 'unknown'

        country_data = cls.RESTRICTION_DATA[country]

        # If city is provided but no state, search for the city across all states
        if city and not state:
            for state_code, state_data in country_data.items():
                if isinstance(state_data, dict) and city in state_data:
                    return state_data[city]
            # City not found in any state
            return 'unknown'

        # If no state provided and no city, return unknown
        if not state:
            return 'unknown'

        # Check if state exists in country
        if state not in country_data:
            return 'unknown'

        state_data = country_data[state]

        # If no city provided, return state-level default
        if not city:
            if isinstance(state_data, dict):
                # Return most common restriction level for the state
                levels = list(state_data.values())
                if not levels:
                    return 'unknown'

                level_counts = {}
                for level in levels:
                    level_counts[level] = level_counts.get(level, 0) + 1

                return max(level_counts, key=level_counts.get)
            else:
                return state_data

        # Look up specific city in the given state
        if isinstance(state_data, dict) and city in state_data:
            return state_data[city]

        return 'unknown'


@api_view(['GET'])
@permission_classes([AllowAny])
def covid_restriction_lookup(request):
    """
    Get COVID restriction level for a location

    Query parameters:
    - country: Country code (required)
    - state: State/province code (optional)
    - city: City name (optional)

    Returns:
    {
        "restriction_level": "high|medium|low|unknown"
    }
    """
    try:
        # Get query parameters
        country = request.query_params.get('country')
        state = request.query_params.get('state')
        city = request.query_params.get('city')

        if not country:
            return error_response(
                message='Country parameter is required',
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Get restriction level
        restriction_level = CovidRestrictionService.get_restriction_level(
            country=country,
            state=state,
            city=city
        )

        return success_response(
            data={
                'restriction_level': restriction_level,
                'country': country,
                'state': state,
                'city': city,
            },
            message='COVID restriction level retrieved successfully'
        )

    except Exception as e:
        return error_response(
            message=f'Internal error: {str(e)}',
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
