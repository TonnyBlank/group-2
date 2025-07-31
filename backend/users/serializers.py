from rest_framework import serializers
from .models import User
 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'role', 'school']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'user'),
            school=validated_data.get('school', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user 