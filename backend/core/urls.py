from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet, DealViewSet, OrderViewSet,
    CustomerInteractionViewSet, LoyaltyTransactionViewSet,
    SupportTicketViewSet, MarketingCampaignViewSet,
    dashboard_stats, seed_demo_data, health_check
)

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'deals', DealViewSet, basename='deal')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'interactions', CustomerInteractionViewSet, basename='interaction')
router.register(r'loyalty', LoyaltyTransactionViewSet, basename='loyalty')
router.register(r'tickets', SupportTicketViewSet, basename='ticket')
router.register(r'campaigns', MarketingCampaignViewSet, basename='campaign')

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
    path('seed-data/', seed_demo_data, name='seed-data'),
    path('', include(router.urls)),
]
