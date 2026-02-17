import os
from datetime import timedelta

import django
from django.core.management import call_command
from django.utils import timezone


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mybusapp.settings")

django.setup()


def seed_sample_data() -> None:
    from core.models import Bus, Stop
    from drivers.models import Driver, DriverAssignment
    from feedback.models import Feedback
    from routes.models import Route, RouteStop, Trip

    depot, _ = Stop.objects.get_or_create(name="Soweto Depot")
    cbd, _ = Stop.objects.get_or_create(name="Joburg CBD")
    mall, _ = Stop.objects.get_or_create(name="Maponya Mall")

    bus_1, _ = Bus.objects.get_or_create(registration_number="SOW-001", defaults={"capacity": 60})
    bus_2, _ = Bus.objects.get_or_create(registration_number="SOW-002", defaults={"capacity": 55})

    route_1, _ = Route.objects.get_or_create(
        code="R1",
        defaults={
            "name": "Soweto to CBD",
            "origin_stop": depot,
            "destination_stop": cbd,
            "is_active": True,
        },
    )
    route_2, _ = Route.objects.get_or_create(
        code="R2",
        defaults={
            "name": "Soweto to Maponya Mall",
            "origin_stop": depot,
            "destination_stop": mall,
            "is_active": True,
        },
    )

    RouteStop.objects.get_or_create(route=route_1, stop=depot, order=1)
    RouteStop.objects.get_or_create(route=route_1, stop=cbd, order=2)
    RouteStop.objects.get_or_create(route=route_2, stop=depot, order=1)
    RouteStop.objects.get_or_create(route=route_2, stop=mall, order=2)

    driver_1, _ = Driver.objects.get_or_create(
        license_number="DRV-001",
        defaults={
            "first_name": "Thabo",
            "last_name": "Mokoena",
            "phone_number": "0710000001",
            "is_active": True,
        },
    )
    driver_2, _ = Driver.objects.get_or_create(
        license_number="DRV-002",
        defaults={
            "first_name": "Ayanda",
            "last_name": "Dlamini",
            "phone_number": "0710000002",
            "is_active": True,
        },
    )

    DriverAssignment.objects.get_or_create(driver=driver_1, route=route_1, bus=bus_1, is_active=True)
    DriverAssignment.objects.get_or_create(driver=driver_2, route=route_2, bus=bus_2, is_active=True)

    now = timezone.now()
    trip_1, _ = Trip.objects.get_or_create(
        route=route_1,
        bus=bus_1,
        driver=driver_1,
        departure_time=now,
        defaults={"arrival_time": now + timedelta(minutes=45)},
    )
    trip_2, _ = Trip.objects.get_or_create(
        route=route_2,
        bus=bus_2,
        driver=driver_2,
        departure_time=now + timedelta(hours=1),
        defaults={"arrival_time": now + timedelta(hours=1, minutes=30)},
    )

    Feedback.objects.get_or_create(
        trip=trip_1,
        route=route_1,
        rating=5,
        defaults={
            "comment": "On time and clean bus",
            "passenger_name": "Nomsa",
        },
    )
    Feedback.objects.get_or_create(
        trip=trip_2,
        route=route_2,
        rating=3,
        defaults={
            "comment": "Trip was fine but a bit crowded",
            "passenger_name": "Kabelo",
        },
    )


def main() -> None:
    call_command("makemigrations")
    call_command("migrate")
    seed_sample_data()


if __name__ == "__main__":
    main()
