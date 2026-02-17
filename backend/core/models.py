from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Stop(TimestampedModel):
    name = models.CharField(max_length=255, unique=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class Bus(TimestampedModel):
    registration_number = models.CharField(max_length=50, unique=True)
    capacity = models.PositiveIntegerField(default=40)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.registration_number
