from django.contrib import admin

from feedback.models import Feedback


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ("id", "route", "trip", "rating", "created_at")
    list_filter = ("rating", "route")
