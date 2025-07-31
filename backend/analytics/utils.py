# Analytics utility functions for data analysis and ML predictions
# This file will contain the core AI/ML logic for maintenance insights 

from django.db.models import Count, Avg, Q, F, ExpressionWrapper, fields
from django.utils import timezone
from datetime import timedelta
from tickets.models import Ticket
from equipment.models import Equipment

def calculate_equipment_health_score(equipment_id):
    """
    Calculate a health score for equipment based on ticket history
    Returns a score from 0-100 (100 = excellent health)
    """
    try:
        equipment = Equipment.objects.get(id=equipment_id)
        
        # Get tickets in the last 6 months
        six_months_ago = timezone.now() - timedelta(days=180)
        recent_tickets = Ticket.objects.filter(
            equipment=equipment,
            created_at__gte=six_months_ago
        )
        
        total_tickets = recent_tickets.count()
        resolved_tickets = recent_tickets.filter(status='resolved').count()
        
        # Calculate health score based on:
        # 1. Number of issues (fewer is better)
        # 2. Resolution rate (higher is better)
        # 3. Time since last issue (longer is better)
        
        if total_tickets == 0:
            return 100  # No issues = perfect health
        
        resolution_rate = (resolved_tickets / total_tickets) * 100 if total_tickets > 0 else 0
        
        # Penalty for number of issues (more sensitive to recent activity)
        issue_penalty = min(total_tickets * 15, 60)  # Increased penalty for recent issues
        
        # Bonus for resolution rate
        resolution_bonus = resolution_rate * 0.2  # Reduced bonus to make recent issues more impactful
        
        # Time since last issue bonus (more sensitive to recent activity)
        last_issue = recent_tickets.order_by('-created_at').first()
        if last_issue:
            days_since_issue = (timezone.now() - last_issue.created_at).days
            # More aggressive time penalty for very recent issues
            if days_since_issue <= 7:
                time_bonus = -10  # Penalty for very recent issues
            elif days_since_issue <= 30:
                time_bonus = 0    # No bonus for recent issues
            else:
                time_bonus = min((days_since_issue - 30) * 0.3, 15)  # Gradual bonus for older issues
        else:
            time_bonus = 15
        
        health_score = 100 - issue_penalty + resolution_bonus + time_bonus
        return max(0, min(100, health_score))
        
    except Equipment.DoesNotExist:
        return 0

def predict_maintenance_needs():
    """
    AI-powered prediction for equipment that needs maintenance
    Returns list of equipment with predicted maintenance needs and preventive measures
    """
    predictions = []
    
    # Get all equipment
    all_equipment = Equipment.objects.all()
    
    for equipment in all_equipment:
        health_score = calculate_equipment_health_score(equipment.id)
        
        # Get recent ticket patterns
        three_months_ago = timezone.now() - timedelta(days=90)
        recent_tickets = Ticket.objects.filter(
            equipment=equipment,
            created_at__gte=three_months_ago
        )
        
        ticket_count = recent_tickets.count()
        
        # Analyze issue categories for this equipment
        issue_categories = recent_tickets.values('issue_category').annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Calculate average resolution time for resolved tickets
        resolved_tickets = recent_tickets.filter(status='resolved')
        if resolved_tickets.exists():
            resolution_times = []
            for ticket in resolved_tickets:
                if ticket.updated_at and ticket.created_at:
                    time_diff = (ticket.updated_at - ticket.created_at).days
                    resolution_times.append(time_diff)
            avg_resolution_time = sum(resolution_times) / len(resolution_times) if resolution_times else 0
        else:
            avg_resolution_time = 0
        
        # Enhanced prediction logic with preventive measures
        maintenance_needed = False
        urgency = 'low'
        reason = ''
        preventive_measures = []
        estimated_cost = 0
        
        if health_score < 30:
            maintenance_needed = True
            urgency = 'high'
            reason = f"Critical health score ({health_score:.1f}/100)"
            preventive_measures = generate_preventive_measures(equipment.type, 'critical', issue_categories)
            estimated_cost = 500  # High cost for critical maintenance
        elif ticket_count >= 3:
            maintenance_needed = True
            urgency = 'medium'
            reason = f"{ticket_count} issues in last 90 days"
            preventive_measures = generate_preventive_measures(equipment.type, 'frequent_issues', issue_categories)
            estimated_cost = 200  # Medium cost for preventive maintenance
        elif health_score < 60:
            maintenance_needed = True
            urgency = 'low'
            reason = f"Declining health score ({health_score:.1f}/100)"
            preventive_measures = generate_preventive_measures(equipment.type, 'declining', issue_categories)
            estimated_cost = 100  # Low cost for routine maintenance
        
        if maintenance_needed:
            predictions.append({
                'equipment_id': equipment.id,
                'equipment_type': equipment.type,
                'location': equipment.location,
                'health_score': round(health_score, 1),
                'urgency': urgency,
                'reason': reason,
                'recent_tickets': ticket_count,
                'predicted_maintenance_date': timezone.now() + timedelta(days=30 if urgency == 'high' else 60),
                'preventive_measures': preventive_measures,
                'estimated_cost': estimated_cost,
                'common_issues': list(issue_categories[:3]),  # Top 3 most common issues
                'avg_resolution_time': round(avg_resolution_time, 1)
            })
    
    return sorted(predictions, key=lambda x: {'high': 0, 'medium': 1, 'low': 2}[x['urgency']])

def generate_preventive_measures(equipment_type, issue_type, issue_categories):
    """
    Generate specific preventive measures based on equipment type and issues
    """
    measures = []
    
    # Equipment-specific preventive measures
    if equipment_type == 'pc':
        measures.extend([
            "Run disk cleanup and defragmentation",
            "Update antivirus software and run full scan",
            "Check and clean internal components (dust removal)",
            "Update operating system and drivers",
            "Backup important data"
        ])
    elif equipment_type == 'printer':
        measures.extend([
            "Clean print heads and nozzles",
            "Check ink/toner levels and replace if low",
            "Clean paper feed rollers",
            "Update printer drivers",
            "Check for paper jams and clear if any"
        ])
    elif equipment_type == 'projector':
        measures.extend([
            "Clean air filters and vents",
            "Check lamp hours and replace if needed",
            "Clean lens and mirrors",
            "Check cooling system",
            "Update firmware if available"
        ])
    elif equipment_type == 'router':
        measures.extend([
            "Update firmware to latest version",
            "Check and optimize network settings",
            "Clean device and ensure proper ventilation",
            "Check cable connections",
            "Monitor bandwidth usage"
        ])
    elif equipment_type == 'ups':
        measures.extend([
            "Test battery backup functionality",
            "Check battery health and replace if needed",
            "Clean device and ensure proper ventilation",
            "Update firmware if available",
            "Check load capacity"
        ])
    
    # Issue-specific measures
    if issue_type == 'critical':
        measures.extend([
            "Immediate professional inspection required",
            "Schedule emergency maintenance",
            "Consider replacement if cost exceeds repair value",
            "Document all issues for warranty claims"
        ])
    elif issue_type == 'frequent_issues':
        measures.extend([
            "Implement regular maintenance schedule",
            "Train users on proper equipment usage",
            "Consider upgrading to newer model",
            "Set up monitoring alerts"
        ])
    elif issue_type == 'declining':
        measures.extend([
            "Schedule routine maintenance",
            "Monitor performance metrics",
            "Plan for eventual replacement",
            "Implement preventive maintenance schedule"
        ])
    
    return measures

def get_preventive_maintenance_schedule():
    """
    Generate a comprehensive preventive maintenance schedule
    Only includes equipment that actually needs maintenance
    """
    schedule = {
        'daily': [],
        'weekly': [],
        'monthly': [],
        'quarterly': [],
        'annually': []
    }
    
    # Get all equipment
    all_equipment = Equipment.objects.all()
    
    for equipment in all_equipment:
        health_score = calculate_equipment_health_score(equipment.id)
        
        # Only add equipment that actually needs maintenance (health score < 98)
        # Equipment with health score 98+ is considered in excellent condition
        if health_score < 40:
            schedule['weekly'].append({
                'equipment_id': equipment.id,
                'equipment_type': equipment.type,
                'location': equipment.location,
                'tasks': generate_preventive_measures(equipment.type, 'critical', [])
            })
        elif health_score < 70:
            schedule['monthly'].append({
                'equipment_id': equipment.id,
                'equipment_type': equipment.type,
                'location': equipment.location,
                'tasks': generate_preventive_measures(equipment.type, 'declining', [])
            })
        elif health_score < 98:
            schedule['quarterly'].append({
                'equipment_id': equipment.id,
                'equipment_type': equipment.type,
                'location': equipment.location,
                'tasks': generate_preventive_measures(equipment.type, 'routine', [])
            })
        # Equipment with health score 98+ is not included in any schedule (excellent condition)
    
    return schedule

def calculate_maintenance_budget():
    """
    Calculate estimated maintenance budget for the next quarter
    """
    predictions = predict_maintenance_needs()
    
    total_estimated_cost = sum(pred['estimated_cost'] for pred in predictions)
    
    # Categorize by urgency
    high_urgency_cost = sum(pred['estimated_cost'] for pred in predictions if pred['urgency'] == 'high')
    medium_urgency_cost = sum(pred['estimated_cost'] for pred in predictions if pred['urgency'] == 'medium')
    low_urgency_cost = sum(pred['estimated_cost'] for pred in predictions if pred['urgency'] == 'low')
    
    return {
        'total_estimated_cost': total_estimated_cost,
        'high_urgency_cost': high_urgency_cost,
        'medium_urgency_cost': medium_urgency_cost,
        'low_urgency_cost': low_urgency_cost,
        'equipment_count': len(predictions),
        'recommendations': [
            "Prioritize high urgency maintenance to prevent equipment failure",
            "Schedule medium urgency maintenance within 60 days",
            "Plan low urgency maintenance for routine maintenance cycles"
        ]
    }

def analyze_issue_patterns():
    """
    Analyze patterns in ticket data to identify trends
    """
    # Get data from last 6 months
    six_months_ago = timezone.now() - timedelta(days=180)
    
    # Equipment type failure patterns
    equipment_patterns = (
        Ticket.objects.filter(created_at__gte=six_months_ago)
        .values('equipment__type')
        .annotate(
            total_issues=Count('id'),
            resolved_issues=Count('id', filter=Q(status='resolved'))
        )
    )
    
    # Location-based patterns
    location_patterns = (
        Ticket.objects.filter(created_at__gte=six_months_ago)
        .values('equipment__location')
        .annotate(
            total_issues=Count('id'),
            resolved_issues=Count('id', filter=Q(status='resolved'))
        )
    )
    
    # Time-based patterns (monthly trends) - simplified for SQLite compatibility
    monthly_trends = (
        Ticket.objects.filter(created_at__gte=six_months_ago)
        .values('created_at__month')
        .annotate(issue_count=Count('id'))
        .order_by('created_at__month')
    )
    
    return {
        'equipment_patterns': list(equipment_patterns),
        'location_patterns': list(location_patterns),
        'monthly_trends': list(monthly_trends)
    } 