#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'silsp.settings')
django.setup()

from django.contrib.auth import get_user_model
from equipment.models import Equipment
from tickets.models import Ticket
from tickets.serializers import TicketSerializer
from rest_framework.test import APIRequestFactory
from rest_framework.test import force_authenticate

User = get_user_model()

def test_ticket_creation():
    print("Testing ticket creation...")
    
    # Create test user if not exists
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={
            'email': 'test@example.com',
            'role': 'user',
            'school': 'Test School'
        }
    )
    if created:
        user.set_password('testpass123')
        user.save()
        print(f"Created test user: {user.username}")
    
    # Create test equipment if not exists
    equipment, created = Equipment.objects.get_or_create(
        serial_number='TEST001',
        defaults={
            'type': 'pc',
            'location': 'Lab 1',
            'school': 'Test School',
            'is_working': True
        }
    )
    if created:
        print(f"Created test equipment: {equipment}")
    
    # Test data
    test_data = {
        'equipment': equipment.id,
        'issue_category': 'Hardware Issue',
        'description': 'Test ticket description',
        'status': 'open'
    }
    
    print(f"Test data: {test_data}")
    
    # Test serializer
    serializer = TicketSerializer(data=test_data)
    if serializer.is_valid():
        print("✓ Serializer validation passed")
        print(f"Validated data: {serializer.validated_data}")
    else:
        print("✗ Serializer validation failed")
        print(f"Errors: {serializer.errors}")
        return False
    
    # Test API request
    factory = APIRequestFactory()
    request = factory.post('/api/tickets/', test_data)
    force_authenticate(request, user=user)
    
    from tickets.views import TicketViewSet
    viewset = TicketViewSet()
    viewset.request = request
    viewset.action = 'create'
    
    try:
        response = viewset.create(request)
        print(f"✓ API response status: {response.status_code}")
        if response.status_code == 201:
            print("✓ Ticket creation successful!")
            return True
        else:
            print(f"✗ API failed with status {response.status_code}")
            print(f"Response data: {response.data}")
            return False
    except Exception as e:
        print(f"✗ Exception during API test: {str(e)}")
        return False

if __name__ == '__main__':
    success = test_ticket_creation()
    if success:
        print("\n🎉 All tests passed! Ticket creation should work.")
    else:
        print("\n❌ Tests failed. Check the errors above.")
    sys.exit(0 if success else 1) 