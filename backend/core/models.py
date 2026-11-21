from django.db import models
from django.utils import timezone

class Customer(models.Model):
    """
    Retail Customer profile with lifetime value, loyalty metrics, and omnichannel preferences.
    """
    TIER_CHOICES = [
        ('Bronze', 'Bronze Member'),
        ('Silver', 'Silver Member'),
        ('Gold', 'Gold VIP'),
        ('Platinum', 'Platinum Elite'),
    ]

    STATUS_CHOICES = [
        ('Active', 'Active Shopper'),
        ('VIP', 'VIP Frequent'),
        ('At-Risk', 'At-Risk (Inactive 60+ days)'),
        ('Lead', 'New Prospect / Lead'),
        ('Inactive', 'Dormant'),
    ]

    CHANNEL_CHOICES = [
        ('In-Store', 'In-Store POS'),
        ('Online', 'E-Commerce Web'),
        ('Mobile App', 'Mobile App'),
        ('Phone', 'Telephone / Concierge'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30, blank=True, default='')
    avatar_url = models.URLField(max_length=500, blank=True, default='')
    
    loyalty_tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='Bronze')
    loyalty_points = models.IntegerField(default=100)
    total_spend = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    preferred_channel = models.CharField(max_length=30, choices=CHANNEL_CHOICES, default='In-Store')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    
    address = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    postal_code = models.CharField(max_length=20, blank=True, default='')
    country = models.CharField(max_length=100, default='United States')
    
    # JSON list of tags e.g. ["VIP", "Frequent Buyer", "Weekend Shopper"]
    tags = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class Deal(models.Model):
    """
    Sales Pipeline & B2B / High-value Clienteling Opportunity.
    """
    STAGE_CHOICES = [
        ('Lead', 'New Lead'),
        ('Contacted', 'Contacted / Follow-up'),
        ('Qualified', 'Qualified Buyer'),
        ('Proposal', 'Proposal / Custom Quote'),
        ('Won', 'Closed Won'),
        ('Lost', 'Closed Lost'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low Priority'),
        ('Medium', 'Medium Priority'),
        ('High', 'High Priority'),
    ]

    title = models.CharField(max_length=200)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='deals')
    value = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='Lead')
    probability = models.IntegerField(default=50) # 0 to 100%
    expected_close_date = models.DateField(null=True, blank=True)
    assigned_agent = models.CharField(max_length=100, default='Sarah Jenkins')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    notes = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - ${self.value} ({self.stage})"


class Order(models.Model):
    """
    Omnichannel Retail Purchase / Order record.
    """
    STATUS_CHOICES = [
        ('Completed', 'Completed / Paid'),
        ('Processing', 'Processing Fulfillment'),
        ('Shipped', 'Shipped / Dispatched'),
        ('Returned', 'Returned / Refunded'),
        ('Cancelled', 'Cancelled'),
    ]

    CHANNEL_CHOICES = [
        ('In-Store POS', 'In-Store POS Register'),
        ('Online Store', 'E-Commerce Web'),
        ('Mobile App', 'Mobile App'),
    ]

    order_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    channel = models.CharField(max_length=30, choices=CHANNEL_CHOICES, default='In-Store POS')
    store_location = models.CharField(max_length=100, default='Downtown Flagship Store')
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Completed')
    payment_method = models.CharField(max_length=50, default='Credit Card')
    items_count = models.IntegerField(default=1)
    
    # JSON list of line items: [{"name": "Cashmere Knit Sweater", "sku": "SWT-09", "qty": 1, "price": 180.00}]
    items_detail = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order_number} - ${self.total_amount} ({self.customer.full_name})"


class CustomerInteraction(models.Model):
    """
    Customer touchpoint history (in-store visits, phone calls, emails, support chats).
    """
    TYPE_CHOICES = [
        ('Store Visit', 'In-Store Visit / Consultation'),
        ('Phone Call', 'Phone Call'),
        ('Email', 'Email Correspondence'),
        ('Live Chat', 'Website Live Chat'),
        ('Support Ticket', 'Support Inquiry'),
        ('Return/Exchange', 'Return or Exchange'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='Store Visit')
    summary = models.CharField(max_length=200)
    details = models.TextField(blank=True, default='')
    agent_name = models.CharField(max_length=100, default='Retail Associate')
    date = models.DateTimeField(default=timezone.now)
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.interaction_type}: {self.summary} ({self.customer.full_name})"


class LoyaltyTransaction(models.Model):
    """
    Points earn and burn transaction ledger.
    """
    TXN_TYPE_CHOICES = [
        ('Earned', 'Points Earned'),
        ('Redeemed', 'Points Redeemed'),
        ('Bonus', 'Promotional Bonus'),
        ('Adjusted', 'Manager Adjustment'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='loyalty_transactions')
    transaction_type = models.CharField(max_length=20, choices=TXN_TYPE_CHOICES, default='Earned')
    points = models.IntegerField() # can be positive or negative
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_type} {self.points} pts for {self.customer.full_name} ({self.reason})"


class SupportTicket(models.Model):
    """
    Retail customer service and complaint resolution ticket.
    """
    CATEGORY_CHOICES = [
        ('Order Issue', 'Order / Delivery Status'),
        ('Return & Refund', 'Return or Refund Request'),
        ('Product Defect', 'Product Quality / Defect'),
        ('Loyalty Points', 'Loyalty Balance Inquiry'),
        ('Billing', 'Billing / Payment Discrepancy'),
        ('General Inquiry', 'Store or General Inquiry'),
    ]

    PRIORITY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Urgent', 'Urgent'),
    ]

    STATUS_CHOICES = [
        ('Open', 'Open Ticket'),
        ('In Progress', 'In Progress'),
        ('Waiting Customer', 'Waiting on Customer'),
        ('Resolved', 'Resolved'),
        ('Closed', 'Closed'),
    ]

    ticket_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='tickets')
    subject = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES, default='General Inquiry')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Open')
    assigned_to = models.CharField(max_length=100, default='Retail Support Team')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.ticket_number}] {self.subject} - {self.status}"


class MarketingCampaign(models.Model):
    """
    Targeted retail marketing and loyalty promotions (Email, SMS, App Push).
    """
    CHANNEL_CHOICES = [
        ('Email', 'Email Newsletter'),
        ('SMS', 'Direct SMS Broadcast'),
        ('Push', 'Mobile App Push Notification'),
    ]

    TIER_TARGET_CHOICES = [
        ('All', 'All Customers'),
        ('Bronze', 'Bronze Members Only'),
        ('Silver', 'Silver Members Only'),
        ('Gold', 'Gold VIPs'),
        ('Platinum', 'Platinum Elite VIPs'),
    ]

    STATUS_CHOICES = [
        ('Draft', 'Draft'),
        ('Scheduled', 'Scheduled'),
        ('Active', 'Active Campaign'),
        ('Completed', 'Completed'),
    ]

    name = models.CharField(max_length=200)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default='Email')
    target_tier = models.CharField(max_length=20, choices=TIER_TARGET_CHOICES, default='All')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Draft')
    discount_code = models.CharField(max_length=50, blank=True, default='')
    
    sent_count = models.IntegerField(default=0)
    opened_count = models.IntegerField(default=0)
    conversion_count = models.IntegerField(default=0)
    
    scheduled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.channel}) - {self.status}"
