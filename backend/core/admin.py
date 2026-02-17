from django.contrib import admin

from core.models import Bus, Stop


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ("name", "latitude", "longitude", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ("registration_number", "capacity", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("registration_number",)
