from django.db import models


class Driver(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=30, blank=True)
    license_number = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"


class DriverAssignment(models.Model):
    driver = models.ForeignKey("drivers.Driver", on_delete=models.CASCADE, related_name="assignments")
    route = models.ForeignKey("routes.Route", on_delete=models.CASCADE, related_name="driver_assignments")
    bus = models.ForeignKey("core.Bus", on_delete=models.CASCADE, related_name="driver_assignments")
    assigned_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("driver", "route", "bus", "is_active")

    def __str__(self) -> str:
        return f"{self.driver} {self.route.code} {self.bus.registration_number}"
