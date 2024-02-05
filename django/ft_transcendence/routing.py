from django.urls import re_path
from home.models import ChatConsumer

websocket_urlpatterns = [
	re_path(r'ws/socket-server/', ChatConsumer.as_asgi())
]
