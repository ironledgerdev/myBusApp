from django.contrib.auth import get_user_model, login
from django.http import HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def dev_auto_login(request):
    User = get_user_model()
    user, _ = User.objects.get_or_create(
        username="admin",
        defaults={
            "email": "admin@example.com",
            "is_staff": True,
            "is_superuser": True,
            "is_active": True,
        },
    )
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.set_password("SowetoBus123!")
    user.save()

    login(request, user)
    return redirect("/admin/")
