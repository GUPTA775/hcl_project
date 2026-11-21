import random
from decimal import Decimal
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import (
    Customer, Deal, Order, CustomerInteraction,
    LoyaltyTransaction, SupportTicket, MarketingCampaign
)

class Command(BaseCommand):
    help = 'Seeds realistic RetailMax CRM demo data including customers, omnichannel orders, deals, loyalty, and tickets.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Seeding RetailMax CRM demo data...'))

        # Check if already seeded to prevent duplication
        if Customer.objects.count() >= 10:
            self.stdout.write(self.style.WARNING('Demo customers already exist. Adding fresh supplemental records...'))

        sample_customers = [
            {
                'first_name': 'Eleanor',
                'last_name': 'Vance',
                'email': 'eleanor.vance@example.com',
                'phone': '+1 (555) 234-5678',
                'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
                'loyalty_tier': 'Platinum',
                'loyalty_points': 5420,
                'total_spend': Decimal('7850.50'),
                'preferred_channel': 'In-Store',
                'status': 'VIP',
                'city': 'New York',
                'state': 'NY',
                'address': '742 Park Avenue, Apt 11B',
                'tags': ['VIP Elite', 'Designer Enthusiast', 'Private Preview Invited', 'High CLV'],
                'notes': 'High-net-worth client. Prefers personal shopping sessions with champagne on Thursday evenings.',
            },
            {
                'first_name': 'Marcus',
                'last_name': 'Sterling',
                'email': 'marcus.sterling@example.com',
                'phone': '+1 (555) 345-6789',
                'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
                'loyalty_tier': 'Gold',
                'loyalty_points': 3240,
                'total_spend': Decimal('4290.00'),
                'preferred_channel': 'Online',
                'status': 'Active',
                'city': 'San Francisco',
                'state': 'CA',
                'address': '450 Mission St, Suite 800',
                'tags': ['Tech Exec', 'E-Commerce First', 'Express Shipping', 'Frequent Buyer'],
                'notes': 'Frequently buys seasonal wardrobes online. Prefers contactless returns and digital receipts.',
            },
            {
                'first_name': 'Sophia',
                'last_name': 'Chen',
                'email': 'sophia.chen@example.com',
                'phone': '+1 (555) 456-7890',
                'avatar_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
                'loyalty_tier': 'Gold',
                'loyalty_points': 2890,
                'total_spend': Decimal('3640.25'),
                'preferred_channel': 'Mobile App',
                'status': 'Active',
                'city': 'Seattle',
                'state': 'WA',
                'address': '1201 3rd Ave',
                'tags': ['App Power User', 'Flash Sale Shopper', 'Active Weekend Shopper'],
                'notes': 'Always orders via iOS App. Responds very well to push notification discounts.',
            },
            {
                'first_name': 'Liam',
                'last_name': 'O\'Connor',
                'email': 'liam.oconnor@example.com',
                'phone': '+1 (555) 567-8901',
                'avatar_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
                'loyalty_tier': 'Silver',
                'loyalty_points': 1450,
                'total_spend': Decimal('1820.00'),
                'preferred_channel': 'In-Store',
                'status': 'Active',
                'city': 'Chicago',
                'state': 'IL',
                'address': '875 N Michigan Ave',
                'tags': ['Footwear Fanatic', 'Weekend Shopper', 'Loyalty Member'],
                'notes': 'Buys luxury sneakers and casual footwear. Interested in athletic collaborations.',
            },
            {
                'first_name': 'Aria',
                'last_name': 'Montgomery',
                'email': 'aria.montgomery@example.com',
                'phone': '+1 (555) 678-9012',
                'avatar_url': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
                'loyalty_tier': 'Bronze',
                'loyalty_points': 650,
                'total_spend': Decimal('740.00'),
                'preferred_channel': 'Online',
                'status': 'At-Risk',
                'city': 'Austin',
                'state': 'TX',
                'address': '200 Congress Ave',
                'tags': ['At-Risk', 'Dormant 45d', 'Discount Seeker'],
                'notes': 'No purchases in 55 days. Target with a 20% win-back promotional SMS voucher.',
            },
            {
                'first_name': 'Julian',
                'last_name': 'Alvarez',
                'email': 'julian.alvarez@example.com',
                'phone': '+1 (555) 789-0123',
                'avatar_url': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
                'loyalty_tier': 'Platinum',
                'loyalty_points': 6100,
                'total_spend': Decimal('9120.00'),
                'preferred_channel': 'In-Store',
                'status': 'VIP',
                'city': 'Miami',
                'state': 'FL',
                'address': '1111 Lincoln Rd',
                'tags': ['VIP Elite', 'Corporate Buyer', 'Bespoke Suiting'],
                'notes': 'Corporate client. Frequently orders customized team corporate apparel and tailored suits.',
            },
            {
                'first_name': 'Clara',
                'last_name': 'Oswald',
                'email': 'clara.oswald@example.com',
                'phone': '+1 (555) 890-1234',
                'avatar_url': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
                'loyalty_tier': 'Bronze',
                'loyalty_points': 150,
                'total_spend': Decimal('220.00'),
                'preferred_channel': 'Online',
                'status': 'Lead',
                'city': 'Boston',
                'state': 'MA',
                'address': '100 Boylston St',
                'tags': ['New Prospect', 'First-Time Buyer', 'Lead'],
                'notes': 'Joined via Instagram summer campaign advertisement.',
            },
            {
                'first_name': 'David',
                'last_name': 'Kim',
                'email': 'david.kim@example.com',
                'phone': '+1 (555) 901-2345',
                'avatar_url': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
                'loyalty_tier': 'Silver',
                'loyalty_points': 1850,
                'total_spend': Decimal('2450.00'),
                'preferred_channel': 'In-Store',
                'status': 'Active',
                'city': 'Los Angeles',
                'state': 'CA',
                'address': '10250 Santa Monica Blvd',
                'tags': ['Accessories Buyer', 'Century City Local'],
                'notes': 'Regular at Century City flagship boutique.',
            }
        ]

        created_customers = []
        for cust_data in sample_customers:
            cust, _ = Customer.objects.update_or_create(
                email=cust_data['email'],
                defaults=cust_data
            )
            created_customers.append(cust)

        self.stdout.write(f"Synced {len(created_customers)} retail customers.")

        # Seed Omnichannel Orders
        now = timezone.now()
        sample_orders = [
            {
                'order_number': 'RMX-9041',
                'customer': created_customers[0],
                'channel': 'In-Store POS',
                'store_location': 'Manhattan 5th Ave Flagship',
                'total_amount': Decimal('1450.00'),
                'tax_amount': Decimal('128.69'),
                'discount_amount': Decimal('100.00'),
                'status': 'Completed',
                'payment_method': 'Amex Centurion',
                'items_count': 3,
                'items_detail': [
                    {'name': 'Merino Wool Double-Breasted Coat', 'sku': 'COAT-01', 'qty': 1, 'price': 890.00},
                    {'name': 'Silk Jacquard Scarf', 'sku': 'SCARF-09', 'qty': 1, 'price': 280.00},
                    {'name': 'Leather Chelsea Boots', 'sku': 'BOOT-44', 'qty': 1, 'price': 380.00}
                ],
                'created_at': now - timedelta(days=2)
            },
            {
                'order_number': 'RMX-9042',
                'customer': created_customers[1],
                'channel': 'Online Store',
                'store_location': 'Online Fulfillment Center #1',
                'total_amount': Decimal('680.00'),
                'tax_amount': Decimal('59.50'),
                'discount_amount': Decimal('0.00'),
                'status': 'Completed',
                'payment_method': 'Apple Pay',
                'items_count': 2,
                'items_detail': [
                    {'name': 'Tailored Cotton Oxford Shirt (x2)', 'sku': 'SHIRT-OX', 'qty': 2, 'price': 240.00},
                    {'name': 'Slim Fit Chinos', 'sku': 'PANT-02', 'qty': 2, 'price': 200.00}
                ],
                'created_at': now - timedelta(days=4)
            },
            {
                'order_number': 'RMX-9043',
                'customer': created_customers[2],
                'channel': 'Mobile App',
                'store_location': 'Pacific Northwest DC',
                'total_amount': Decimal('320.00'),
                'tax_amount': Decimal('28.00'),
                'discount_amount': Decimal('30.00'),
                'status': 'Completed',
                'payment_method': 'Visa',
                'items_count': 1,
                'items_detail': [
                    {'name': 'Urban Tech Commuter Backpack', 'sku': 'BAG-TECH', 'qty': 1, 'price': 320.00}
                ],
                'created_at': now - timedelta(days=5)
            },
            {
                'order_number': 'RMX-9044',
                'customer': created_customers[5],
                'channel': 'In-Store POS',
                'store_location': 'Miami Design District Boutique',
                'total_amount': Decimal('2250.00'),
                'tax_amount': Decimal('157.50'),
                'discount_amount': Decimal('200.00'),
                'status': 'Completed',
                'payment_method': 'MasterCard',
                'items_count': 4,
                'items_detail': [
                    {'name': 'Custom Linen Blazer', 'sku': 'BLAZ-MIA', 'qty': 2, 'price': 1200.00},
                    {'name': 'Handcrafted Suede Loafers', 'sku': 'SHOE-LOAF', 'qty': 1, 'price': 450.00},
                    {'name': 'Braided Italian Leather Belt', 'sku': 'BELT-ITL', 'qty': 1, 'price': 180.00}
                ],
                'created_at': now - timedelta(days=7)
            },
            {
                'order_number': 'RMX-9045',
                'customer': created_customers[3],
                'channel': 'In-Store POS',
                'store_location': 'Chicago Magnificent Mile',
                'total_amount': Decimal('490.00'),
                'tax_amount': Decimal('42.00'),
                'discount_amount': Decimal('0.00'),
                'status': 'Completed',
                'payment_method': 'Credit Card',
                'items_count': 2,
                'items_detail': [
                    {'name': 'Limited Edition Runner v3', 'sku': 'SNEAK-V3', 'qty': 1, 'price': 310.00},
                    {'name': 'Performance Knit Socks (Pack of 3)', 'sku': 'SOCK-PK3', 'qty': 2, 'price': 90.00}
                ],
                'created_at': now - timedelta(days=12)
            }
        ]

        for ord_data in sample_orders:
            Order.objects.update_or_create(
                order_number=ord_data['order_number'],
                defaults=ord_data
            )
        self.stdout.write("Created omnichannel retail orders.")

        # Seed Deals / Pipeline
        sample_deals = [
            {
                'title': 'Corporate Executive Suiting Package (15 Suits)',
                'customer': created_customers[5],
                'value': Decimal('12500.00'),
                'stage': 'Proposal',
                'probability': 75,
                'expected_close_date': (now + timedelta(days=14)).date(),
                'assigned_agent': 'Marcus Brody (VIP Clienteling)',
                'priority': 'High',
                'notes': 'Requested bespoke fabric samples and in-office fitting schedule.'
            },
            {
                'title': 'Spring Private Wardrobe Consultation & Refresh',
                'customer': created_customers[0],
                'value': Decimal('4800.00'),
                'stage': 'Qualified',
                'probability': 80,
                'expected_close_date': (now + timedelta(days=8)).date(),
                'assigned_agent': 'Sarah Jenkins (Lead Stylist)',
                'priority': 'High',
                'notes': 'Eleanor looking for full spring collection preview.'
            },
            {
                'title': 'Holiday Bulk Gifting - Tech Executive Group',
                'customer': created_customers[1],
                'value': Decimal('3600.00'),
                'stage': 'Contacted',
                'probability': 60,
                'expected_close_date': (now + timedelta(days=21)).date(),
                'assigned_agent': 'Sarah Jenkins',
                'priority': 'Medium',
                'notes': 'Leather goods and tech accessories with monogramming.'
            },
            {
                'title': 'New Member VIP Membership Upgrade Concierge',
                'customer': created_customers[6],
                'value': Decimal('1200.00'),
                'stage': 'Lead',
                'probability': 35,
                'expected_close_date': (now + timedelta(days=30)).date(),
                'assigned_agent': 'Tyler Ross',
                'priority': 'Low',
                'notes': 'Inbound inquiry from Instagram ad.'
            },
            {
                'title': 'Designer Footwear Capsule Pre-Order',
                'customer': created_customers[3],
                'value': Decimal('1950.00'),
                'stage': 'Won',
                'probability': 100,
                'expected_close_date': (now - timedelta(days=3)).date(),
                'assigned_agent': 'Tyler Ross',
                'priority': 'Medium',
                'notes': 'Pre-order secured with deposit.'
            }
        ]

        for deal_data in sample_deals:
            Deal.objects.update_or_create(
                title=deal_data['title'],
                customer=deal_data['customer'],
                defaults=deal_data
            )
        self.stdout.write("Created sales pipeline deals.")

        # Seed Customer Interactions
        sample_interactions = [
            {
                'customer': created_customers[0],
                'interaction_type': 'Store Visit',
                'summary': 'Private Suite VIP Consultation',
                'details': 'Eleanor visited the 5th Avenue salon. Tried the Fall cashmere collection and pre-ordered the double-breasted coat.',
                'agent_name': 'Sarah Jenkins',
                'date': now - timedelta(days=2),
                'follow_up_required': True,
                'follow_up_date': (now + timedelta(days=5)).date()
            },
            {
                'customer': created_customers[1],
                'interaction_type': 'Live Chat',
                'summary': 'Sizing inquiry for slim chinos',
                'details': 'Marcus inquired about waist sizing variance between denim and chinos. Provided sizing chart.',
                'agent_name': 'Tyler Ross',
                'date': now - timedelta(days=4),
                'follow_up_required': False,
            },
            {
                'customer': created_customers[4],
                'interaction_type': 'Email',
                'summary': 'We Miss You 20% Voucher Sent',
                'details': 'Sent automated re-engagement email with coupon code RETAILMAX20.',
                'agent_name': 'Marketing Automation',
                'date': now - timedelta(days=6),
                'follow_up_required': True,
                'follow_up_date': (now + timedelta(days=7)).date()
            },
            {
                'customer': created_customers[5],
                'interaction_type': 'Phone Call',
                'summary': 'Corporate fitting session scheduling',
                'details': 'Discussed date for executive team measurements at Brickell office.',
                'agent_name': 'Marcus Brody',
                'date': now - timedelta(days=1),
                'follow_up_required': True,
                'follow_up_date': (now + timedelta(days=3)).date()
            }
        ]

        for item in sample_interactions:
            CustomerInteraction.objects.create(**item)

        # Seed Support Tickets
        sample_tickets = [
            {
                'ticket_number': 'TCK-1081',
                'customer': created_customers[4],
                'subject': 'Size exchange request for order RMX-8712',
                'description': 'Customer received Medium size instead of Large. Wants express swap before weekend trip.',
                'category': 'Return & Refund',
                'priority': 'High',
                'status': 'In Progress',
                'assigned_to': 'Customer Care Team'
            },
            {
                'ticket_number': 'TCK-1082',
                'customer': created_customers[2],
                'subject': 'Loyalty points not credited after in-app purchase',
                'description': 'Ordered tech backpack 5 days ago, 320 points have not appeared in app balance.',
                'category': 'Loyalty Points',
                'priority': 'Medium',
                'status': 'Open',
                'assigned_to': 'Tyler Ross'
            },
            {
                'ticket_number': 'TCK-1083',
                'customer': created_customers[1],
                'subject': 'Tracking number says delivered but package missing',
                'description': 'Carrier marked package as delivered to mailroom. Building front desk confirmed safe receipt.',
                'category': 'Order Issue',
                'priority': 'Medium',
                'status': 'Resolved',
                'assigned_to': 'Sarah Jenkins'
            }
        ]

        for tck in sample_tickets:
            SupportTicket.objects.update_or_create(
                ticket_number=tck['ticket_number'],
                defaults=tck
            )

        # Seed Marketing Campaigns
        sample_campaigns = [
            {
                'name': 'VIP Private Autumn Preview Event',
                'channel': 'Email',
                'target_tier': 'Platinum',
                'status': 'Active',
                'discount_code': 'VIPPREVIEW25',
                'sent_count': 142,
                'opened_count': 118,
                'conversion_count': 49,
            },
            {
                'name': 'Mobile App Flash Sale 24-Hour Pass',
                'channel': 'Push',
                'target_tier': 'All',
                'status': 'Completed',
                'discount_code': 'APPOVERDRIVE',
                'sent_count': 4500,
                'opened_count': 2140,
                'conversion_count': 612,
            },
            {
                'name': 'At-Risk Winback Concierge SMS',
                'channel': 'SMS',
                'target_tier': 'Bronze',
                'status': 'Active',
                'discount_code': 'COMEBACK30',
                'sent_count': 320,
                'opened_count': 295,
                'conversion_count': 42,
            }
        ]

        for cmp in sample_campaigns:
            MarketingCampaign.objects.update_or_create(
                name=cmp['name'],
                defaults=cmp
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded RetailMax CRM demo ecosystem!'))
