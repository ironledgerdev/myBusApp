from django.contrib import admin

from drivers.models import Driver, DriverAssignment


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "phone_number", "license_number", "is_active")
    list_filter = ("is_active",)
    search_fields = ("first_name", "last_name", "license_number")


@admin.register(DriverAssignment)
class DriverAssignmentAdmin(admin.ModelAdmin):
    list_display = ("driver", "route", "bus", "is_active", "assigned_at")
    list_filter = ("is_active", "route", "bus")
