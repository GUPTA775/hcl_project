from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import (
    Customer, Deal, Order, CustomerInteraction,
    LoyaltyTransaction, SupportTicket, MarketingCampaign
)
from .serializers import (
    CustomerSerializer, CustomerDetailSerializer,
    DealSerializer, OrderSerializer, CustomerInteractionSerializer,
    LoyaltyTransactionSerializer, SupportTicketSerializer,
    MarketingCampaignSerializer
)
from retailmax.supabase_client import check_supabase_connection


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CustomerDetailSerializer
        return CustomerSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get('search', '').strip()
        tier = self.request.query_params.get('tier', '').strip()
        customer_status = self.request.query_params.get('status', '').strip()

        if search:
            qs = qs.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(city__icontains=search)
            )
        if tier and tier != 'All':
            qs = qs.filter(loyalty_tier=tier)
        if customer_status and customer_status != 'All':
            qs = qs.filter(status=customer_status)
        return qs

    @action(detail=True, methods=['post'], url_path='adjust-loyalty')
    def adjust_loyalty(self, request, pk=None):
        customer = self.get_object()
        points = int(request.data.get('points', 0))
        reason = request.data.get('reason', 'Manual Adjustment')
        
        customer.loyalty_points = max(0, customer.loyalty_points + points)
        
        # Auto update tier based on points
        if customer.loyalty_points >= 5000:
            customer.loyalty_tier = 'Platinum'
        elif customer.loyalty_points >= 2500:
            customer.loyalty_tier = 'Gold'
        elif customer.loyalty_points >= 1000:
            customer.loyalty_tier = 'Silver'
        else:
            customer.loyalty_tier = 'Bronze'
            
        customer.save()

        LoyaltyTransaction.objects.create(
            customer=customer,
            transaction_type='Adjusted' if points >= 0 else 'Redeemed',
            points=points,
            reason=reason
        )

        return Response({
            'success': True,
            'loyalty_points': customer.loyalty_points,
            'loyalty_tier': customer.loyalty_tier,
            'message': f"Successfully updated loyalty balance by {points} points."
        })


class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        stage = self.request.query_params.get('stage', '').strip()
        priority = self.request.query_params.get('priority', '').strip()
        if stage and stage != 'All':
            qs = qs.filter(stage=stage)
        if priority and priority != 'All':
            qs = qs.filter(priority=priority)
        return qs


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        channel = self.request.query_params.get('channel', '').strip()
        order_status = self.request.query_params.get('status', '').strip()
        customer_id = self.request.query_params.get('customer', '').strip()

        if channel and channel != 'All':
            qs = qs.filter(channel=channel)
        if order_status and order_status != 'All':
            qs = qs.filter(status=order_status)
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        return qs


class CustomerInteractionViewSet(viewsets.ModelViewSet):
    queryset = CustomerInteraction.objects.all()
    serializer_class = CustomerInteractionSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        customer_id = self.request.query_params.get('customer', '').strip()
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        return qs


class LoyaltyTransactionViewSet(viewsets.ModelViewSet):
    queryset = LoyaltyTransaction.objects.all()
    serializer_class = LoyaltyTransactionSerializer


class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        ticket_status = self.request.query_params.get('status', '').strip()
        priority = self.request.query_params.get('priority', '').strip()
        if ticket_status and ticket_status != 'All':
            qs = qs.filter(status=ticket_status)
        if priority and priority != 'All':
            qs = qs.filter(priority=priority)
        return qs


class MarketingCampaignViewSet(viewsets.ModelViewSet):
    queryset = MarketingCampaign.objects.all()
    serializer_class = MarketingCampaignSerializer


@api_view(['GET'])
def dashboard_stats(request):
    """
    Consolidated KPIs and analytical breakdowns for RetailMax CRM dashboard.
    """
    total_customers = Customer.objects.count()
    vip_count = Customer.objects.filter(status='VIP').count()
    at_risk_count = Customer.objects.filter(status='At-Risk').count()
    
    total_revenue_aggr = Order.objects.filter(status='Completed').aggregate(Sum('total_amount'))
    total_revenue = float(total_revenue_aggr['total_amount__sum'] or 0.0)
    
    pipeline_value_aggr = Deal.objects.exclude(stage__in=['Won', 'Lost']).aggregate(Sum('value'))
    active_pipeline_value = float(pipeline_value_aggr['value__sum'] or 0.0)
    
    open_tickets_count = SupportTicket.objects.exclude(status__in=['Resolved', 'Closed']).count()
    
    # Tier distribution
    tier_counts = {
        'Bronze': Customer.objects.filter(loyalty_tier='Bronze').count(),
        'Silver': Customer.objects.filter(loyalty_tier='Silver').count(),
        'Gold': Customer.objects.filter(loyalty_tier='Gold').count(),
        'Platinum': Customer.objects.filter(loyalty_tier='Platinum').count(),
    }
    
    # Revenue by Channel
    channels = ['In-Store POS', 'Online Store', 'Mobile App']
    channel_revenue = {}
    for ch in channels:
        val = Order.objects.filter(channel=ch, status='Completed').aggregate(Sum('total_amount'))
        channel_revenue[ch] = float(val['total_amount__sum'] or 0.0)

    # Pipeline by Stage
    stages = ['Lead', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost']
    pipeline_stages = {}
    for stg in stages:
        val = Deal.objects.filter(stage=stg).aggregate(Sum('value'), Count('id'))
        pipeline_stages[stg] = {
            'count': val['id__count'] or 0,
            'total_value': float(val['value__sum'] or 0.0)
        }

    # Recent orders
    recent_orders = Order.objects.select_related('customer')[:6]
    recent_orders_data = OrderSerializer(recent_orders, many=True).data

    # Recent interactions
    recent_interactions = CustomerInteraction.objects.select_related('customer')[:6]
    recent_interactions_data = CustomerInteractionSerializer(recent_interactions, many=True).data

    return Response({
        'kpis': {
            'total_customers': total_customers,
            'vip_customers': vip_count,
            'at_risk_customers': at_risk_count,
            'total_revenue': round(total_revenue, 2),
            'active_pipeline_value': round(active_pipeline_value, 2),
            'open_tickets': open_tickets_count,
            'total_orders': Order.objects.count(),
        },
        'tier_distribution': tier_counts,
        'channel_revenue': channel_revenue,
        'pipeline_stages': pipeline_stages,
        'recent_orders': recent_orders_data,
        'recent_interactions': recent_interactions_data,
        'supabase_status': check_supabase_connection(),
    })


@api_view(['POST', 'GET'])
def seed_demo_data(request):
    """
    Populates sample retail customers, orders, deals, loyalty and tickets.
    """
    from django.core.management import call_command
    try:
        call_command('seed_retail_data')
        return Response({
            'status': 'success',
            'message': 'RetailMax CRM demo retail data successfully populated!',
            'customers_count': Customer.objects.count(),
            'orders_count': Order.objects.count(),
            'deals_count': Deal.objects.count(),
            'tickets_count': SupportTicket.objects.count(),
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def health_check(request):
    """
    System and database health diagnostic endpoint.
    """
    return Response({
        'status': 'healthy',
        'service': 'RetailMax CRM API Engine',
        'timestamp': timezone.now().isoformat(),
        'database': check_supabase_connection(),
    })
