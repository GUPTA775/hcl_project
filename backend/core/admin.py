from django.contrib import admin
from .models import (
    Customer, Deal, Order, CustomerInteraction,
    LoyaltyTransaction, SupportTicket, MarketingCampaign
)

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'loyalty_tier', 'loyalty_points', 'total_spend', 'status', 'preferred_channel')
    search_fields = ('first_name', 'last_name', 'email', 'phone', 'city')
    list_filter = ('loyalty_tier', 'status', 'preferred_channel')

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('title', 'customer', 'value', 'stage', 'probability', 'assigned_agent', 'expected_close_date')
    list_filter = ('stage', 'priority', 'assigned_agent')
    search_fields = ('title', 'customer__first_name', 'customer__last_name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'channel', 'total_amount', 'status', 'created_at')
    list_filter = ('channel', 'status')
    search_fields = ('order_number', 'customer__first_name', 'customer__last_name', 'customer__email')

@admin.register(CustomerInteraction)
class CustomerInteractionAdmin(admin.ModelAdmin):
    list_display = ('interaction_type', 'summary', 'customer', 'agent_name', 'date', 'follow_up_required')
    list_filter = ('interaction_type', 'follow_up_required')

@admin.register(LoyaltyTransaction)
class LoyaltyTransactionAdmin(admin.ModelAdmin):
    list_display = ('customer', 'transaction_type', 'points', 'reason', 'created_at')
    list_filter = ('transaction_type',)

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'subject', 'customer', 'category', 'priority', 'status', 'assigned_to')
    list_filter = ('priority', 'status', 'category')
    search_fields = ('ticket_number', 'subject', 'customer__first_name', 'customer__last_name')

@admin.register(MarketingCampaign)
class MarketingCampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'channel', 'target_tier', 'status', 'sent_count', 'conversion_count')
    list_filter = ('channel', 'status', 'target_tier')
