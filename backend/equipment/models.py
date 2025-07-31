from django.db import models

# Create your models here.

class Equipment(models.Model):
    EQUIPMENT_TYPE_CHOICES = [
        ('pc', 'PC'),
        ('printer', 'Printer'),
        ('projector', 'Projector'),
        ('router', 'Router'),
        ('ups', 'UPS'),
    ]
    type = models.CharField(max_length=20, choices=EQUIPMENT_TYPE_CHOICES)
    serial_number = models.CharField(max_length=100, unique=True)
    location = models.CharField(max_length=100)
    school = models.CharField(max_length=100, default='')
    is_working = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.get_type_display()} ({self.serial_number})"
