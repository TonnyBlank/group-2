from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import Ticket, Comment
from .serializers import TicketSerializer, CommentSerializer

# Create your views here.

class IsTechnicianOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow read for any authenticated user
        if view.action in ['list', 'retrieve']:
            return request.user and request.user.is_authenticated
        # Allow any authenticated user to create tickets
        if view.action == 'create':
            return request.user and request.user.is_authenticated
        # Only allow technicians to update/delete
        return request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'technician'

    def has_object_permission(self, request, view, obj):
        # Allow read-only for any authenticated user
        if view.action in ['retrieve']:
            return request.user and request.user.is_authenticated
        # Only allow technicians to update/delete
        return request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'technician'

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsTechnicianOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            print(f"Creating ticket with data: {request.data}")
            print(f"User: {request.user}")
            print(f"User role: {getattr(request.user, 'role', 'No role')}")
            
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                print("Serializer is valid")
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=201, headers=headers)
            else:
                print(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=400)
        except Exception as e:
            print(f"Exception in create: {str(e)}")
            return Response(
                {'error': str(e), 'detail': 'Failed to create ticket. Please check your input.'},
                status=400
            )

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
