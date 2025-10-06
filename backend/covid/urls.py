from django.urls import path
from .views import covid_restriction_lookup

urlpatterns = [
    # COVID restriction lookup by location
    path('restriction/', covid_restriction_lookup, name='covid-restriction-lookup'),
]
