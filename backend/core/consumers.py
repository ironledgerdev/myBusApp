import json
from channels.generic.websocket import AsyncWebsocketConsumer

class BusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the "buses" group where all updates will be broadcast
        self.group_name = "buses"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        # Handle incoming messages (e.g., from a driver app)
        # For now, we'll just echo it back to the group to simulate movement
        data = json.loads(text_data)
        
        # Broadcast the received data to everyone in the "buses" group
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "bus_update",
                "message": data,
            },
        )

    async def bus_update(self, event):
        # Send the update to the WebSocket
        message = event["message"]
        await self.send(text_data=json.dumps(message))
