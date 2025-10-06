from django.urls import path
from .views import ServiceListView, ServiceDetailView

urlpatterns = [
    path('', ServiceListView.as_view(), name='service-list'),
    path('<uuid:pk>/', ServiceDetailView.as_view(), name='service-detail'),
]
