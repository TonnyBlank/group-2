"""
URL configuration for silsp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# Customize admin site
admin.site.site_header = "School ICT Lab Support Platform - Administration"
admin.site.site_title = "ICT Lab Admin"
admin.site.index_title = "Welcome to School ICT Lab Support Platform Administration"
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from equipment.views import EquipmentViewSet
from tickets.views import TicketViewSet, CommentViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from tickets.report_views import MostFrequentIssuesReport, AverageTurnaroundTimeReport, EquipmentStatusReport
from analytics.views import EquipmentFailurePatternsView, SchoolIssueAnalyticsView, PreventiveMaintenanceView, EquipmentHealthView, IssuePatternsView, PreventiveMaintenanceScheduleView, MaintenanceBudgetView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),  # DRF login/logout
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),         # <-- Add this
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),        # <-- And this
    # Reporting endpoints
    path('api/reports/frequent-issues/', MostFrequentIssuesReport.as_view(), name='report_frequent_issues'),
    path('api/reports/turnaround-time/', AverageTurnaroundTimeReport.as_view(), name='report_turnaround_time'),
    path('api/reports/equipment-status/', EquipmentStatusReport.as_view(), name='report_equipment_status'),
    # Analytics endpoints
    path('api/analytics/equipment-failure-patterns/', EquipmentFailurePatternsView.as_view(), name='equipment_failure_patterns'),
    path('api/analytics/school-issues/', SchoolIssueAnalyticsView.as_view(), name='school_issues_analytics'),
    path('api/analytics/preventive-maintenance/', PreventiveMaintenanceView.as_view(), name='preventive_maintenance'),
    path('api/analytics/equipment-health/', EquipmentHealthView.as_view(), name='equipment_health'),
    path('api/analytics/issue-patterns/', IssuePatternsView.as_view(), name='issue_patterns'),
    path('api/analytics/maintenance-schedule/', PreventiveMaintenanceScheduleView.as_view(), name='maintenance_schedule'),
    path('api/analytics/maintenance-budget/', MaintenanceBudgetView.as_view(), name='maintenance_budget'),
]