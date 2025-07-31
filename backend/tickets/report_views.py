from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from equipment.models import Equipment
from django.db.models import Count, Avg, F, ExpressionWrapper, DurationField
from django.utils import timezone

class MostFrequentIssuesReport(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = (
            Ticket.objects.values('issue_category')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        return Response(data)

class AverageTurnaroundTimeReport(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Only consider resolved tickets
        resolved_tickets = Ticket.objects.filter(status='resolved', created_at__isnull=False, updated_at__isnull=False)
        avg_turnaround = resolved_tickets.annotate(
            turnaround=ExpressionWrapper(F('updated_at') - F('created_at'), output_field=DurationField())
        ).aggregate(avg_turnaround=Avg('turnaround'))['avg_turnaround']
        return Response({'average_turnaround_time': avg_turnaround})

class EquipmentStatusReport(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = (
            Equipment.objects.values('is_working')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        return Response(data) 