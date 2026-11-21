from rest_framework import serializers
from .models import (
    Customer, Deal, Order, CustomerInteraction,
    LoyaltyTransaction, SupportTicket, MarketingCampaign
)

class CustomerInteractionSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')

    class Meta:
        model = CustomerInteraction
        fields = '__all__'


class LoyaltyTransactionSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')

    class Meta:
        model = LoyaltyTransaction
        fields = '__all__'


class SupportTicketSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    customer_email = serializers.ReadOnlyField(source='customer.email')

    class Meta:
        model = SupportTicket
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    customer_email = serializers.ReadOnlyField(source='customer.email')

    class Meta:
        model = Order
        fields = '__all__'


class DealSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.full_name')
    customer_email = serializers.ReadOnlyField(source='customer.email')

    class Meta:
        model = Deal
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    orders_count = serializers.IntegerField(source='orders.count', read_only=True)
    deals_count = serializers.IntegerField(source='deals.count', read_only=True)
    tickets_count = serializers.IntegerField(source='tickets.count', read_only=True)

    class Meta:
        model = Customer
        fields = '__all__'


class CustomerDetailSerializer(serializers.ModelSerializer):
    """
    360-degree Customer profile view including nested recent interactions,
    orders, loyalty ledger, and tickets.
    """
    full_name = serializers.ReadOnlyField()
    recent_orders = serializers.SerializerMethodField()
    recent_interactions = serializers.SerializerMethodField()
    recent_tickets = serializers.SerializerMethodField()
    loyalty_ledger = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = '__all__'

    def get_recent_orders(self, obj):
        orders = obj.orders.all()[:5]
        return OrderSerializer(orders, many=True).data

    def get_recent_interactions(self, obj):
        interactions = obj.interactions.all()[:5]
        return CustomerInteractionSerializer(interactions, many=True).data

    def get_recent_tickets(self, obj):
        tickets = obj.tickets.all()[:5]
        return SupportTicketSerializer(tickets, many=True).data

    def get_loyalty_ledger(self, obj):
        txns = obj.loyalty_transactions.all()[:5]
        return LoyaltyTransactionSerializer(txns, many=True).data


class MarketingCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketingCampaign
        fields = '__all__'
