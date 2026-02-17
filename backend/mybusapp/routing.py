from django.urls import re_path
from core.consumers import BusConsumer

websocket_urlpatterns = [
    re_path(r"ws/buses/$", BusConsumer.as_asgi()),
]
