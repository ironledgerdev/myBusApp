from django.contrib import admin

from routes.models import Route, RouteStop, Trip


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "origin_stop", "destination_stop", "is_active")
    list_filter = ("is_active",)
    search_fields = ("code", "name")


@admin.register(RouteStop)
class RouteStopAdmin(admin.ModelAdmin):
    list_display = ("route", "order", "stop")
    list_filter = ("route",)


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("route", "bus", "driver", "departure_time", "arrival_time")
    list_filter = ("route", "driver", "bus")
