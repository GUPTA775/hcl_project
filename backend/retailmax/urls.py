"""
RetailMax CRM URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from retailmax.supabase_client import check_supabase_connection

def api_root(request):
    return JsonResponse({
        'name': 'RetailMax CRM API',
        'version': '1.0.0',
        'description': 'Streamlining Customer Relationships for Modern Omnichannel Retail',
        'status': 'online',
        'supabase': check_supabase_connection(),
        'endpoints': {
            'dashboard_stats': '/api/dashboard/stats/',
            'customers': '/api/customers/',
            'deals': '/api/deals/',
            'orders': '/api/orders/',
            'interactions': '/api/interactions/',
            'loyalty_transactions': '/api/loyalty/',
            'tickets': '/api/tickets/',
            'campaigns': '/api/campaigns/',
            'seed_demo_data': '/api/seed-data/',
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', api_root, name='api-index'),
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]
