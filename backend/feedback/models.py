from django.db import models


class Feedback(models.Model):
    route = models.ForeignKey("routes.Route", on_delete=models.SET_NULL, null=True, blank=True, related_name="feedback")
    trip = models.ForeignKey("routes.Trip", on_delete=models.SET_NULL, null=True, blank=True, related_name="feedback")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    passenger_name = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Feedback {self.id} {self.rating}"
