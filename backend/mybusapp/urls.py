from django.contrib import admin
from django.urls import path

from core.views import dev_auto_login

urlpatterns = [
    path("admin/", admin.site.urls),
    path("dev-auto-login/", dev_auto_login, name="dev_auto_login"),
]
