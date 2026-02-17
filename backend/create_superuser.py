import os

import django
from django.contrib.auth import get_user_model


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mybusapp.settings")

django.setup()


def main() -> None:
    User = get_user_model()
    username = "admin"
    email = "admin@example.com"
    password = "SowetoBus123!"

    user, _ = User.objects.get_or_create(
        username=username,
        defaults={
            "email": email,
            "is_staff": True,
            "is_superuser": True,
        },
    )

    user.email = email
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.set_password(password)
    user.save()

    print(
        "superuser",
        user.username,
        "active",
        user.is_active,
        "is_superuser",
        user.is_superuser,
        "password_ok",
        user.check_password(password),
    )


if __name__ == "__main__":
    main()
