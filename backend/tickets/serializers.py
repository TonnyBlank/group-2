from rest_framework import serializers
from .models import Ticket, Comment
from equipment.models import Equipment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'ticket', 'text', 'timestamp']

class TicketSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    assigned_to = serializers.StringRelatedField(read_only=True)
    equipment = serializers.PrimaryKeyRelatedField(queryset=Equipment.objects.all())

    class Meta:
        model = Ticket
        fields = [
            'id', 'equipment', 'issue_category', 'description', 'status',
            'created_by', 'assigned_to', 'created_at', 'updated_at', 'comments'
        ]
        read_only_fields = ['created_by', 'assigned_to', 'created_at', 'updated_at']

    def validate_equipment(self, value):
        if not value:
            raise serializers.ValidationError("Equipment is required.")
        return value

    def validate_issue_category(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Issue category is required.")
        return value.strip()

    def validate_description(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Description is required.")
        return value.strip() 