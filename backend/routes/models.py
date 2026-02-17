from django.db import models


class Route(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    origin_stop = models.ForeignKey("core.Stop", on_delete=models.PROTECT, related_name="origin_routes")
    destination_stop = models.ForeignKey("core.Stop", on_delete=models.PROTECT, related_name="destination_routes")
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.code} {self.name}"


class RouteStop(models.Model):
    route = models.ForeignKey("routes.Route", on_delete=models.CASCADE, related_name="route_stops")
    stop = models.ForeignKey("core.Stop", on_delete=models.CASCADE, related_name="stop_routes")
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ("route", "order")
        ordering = ["order"]

    def __str__(self) -> str:
        return f"{self.route.code} {self.order} {self.stop.name}"


class Trip(models.Model):
    route = models.ForeignKey("routes.Route", on_delete=models.PROTECT, related_name="trips")
    bus = models.ForeignKey("core.Bus", on_delete=models.PROTECT, related_name="trips")
    driver = models.ForeignKey("drivers.Driver", on_delete=models.PROTECT, related_name="trips")
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.route.code} {self.departure_time}"
