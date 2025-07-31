from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from tickets.models import Ticket
from equipment.models import Equipment
from django.db.models import Count
from django.utils import timezone
from .utils import calculate_equipment_health_score, predict_maintenance_needs, analyze_issue_patterns, get_preventive_maintenance_schedule, calculate_maintenance_budget

# Analytics API views for AI-powered insights
# This file will contain endpoints for predictions and analysis 

class EquipmentFailurePatternsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Count number of tickets per equipment type
        data = (
            Ticket.objects.values('equipment__type')
            .annotate(failure_count=Count('id'))
            .order_by('-failure_count')
        )
        return Response(list(data)) 

class SchoolIssueAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = (
            Ticket.objects.values('equipment__school')
            .annotate(issue_count=Count('id'))
            .order_by('-issue_count')
        )
        return Response(list(data)) 

class PreventiveMaintenanceView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Use AI-powered prediction instead of simple counting
        predictions = predict_maintenance_needs()
        return Response(predictions)

class EquipmentHealthView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """Get health scores for all equipment"""
        equipment_list = Equipment.objects.all()
        health_data = []
        
        for equipment in equipment_list:
            health_score = calculate_equipment_health_score(equipment.id)
            health_data.append({
                'equipment_id': equipment.id,
                'equipment_type': equipment.type,
                'location': equipment.location,
                'serial_number': equipment.serial_number,
                'health_score': round(health_score, 1),
                'status': 'Excellent' if health_score >= 80 else 'Good' if health_score >= 60 else 'Fair' if health_score >= 40 else 'Poor'
            })
        
        return Response(health_data)

class IssuePatternsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """Get comprehensive issue pattern analysis"""
        patterns = analyze_issue_patterns()
        return Response(patterns)

class PreventiveMaintenanceScheduleView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """Get preventive maintenance schedule"""
        schedule = get_preventive_maintenance_schedule()
        return Response(schedule)

class MaintenanceBudgetView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """Get maintenance budget estimates"""
        budget = calculate_maintenance_budget()
        return Response(budget) 