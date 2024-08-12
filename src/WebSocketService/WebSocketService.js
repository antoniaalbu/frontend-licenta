import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.listeners = [];
  }

  connect() {
    const socket = new SockJS('http://localhost:8081/ws');
    this.client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');

        
        this.isConnected = true;
        this.listeners.forEach(({ topic, listener }) => {
          this.subscribe(topic, listener);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        this.isConnected = false;
      }
    });
    this.client.activate();
  }

  subscribe(topic, listener) {
    if (!this.isConnected) {
      // If not connected, store the subscription to be processed later
      this.listeners.push({ topic, listener });
      return;
    }
    // Subscribe to the specified topic
    this.client.subscribe(topic, message => {
      const data = JSON.parse(message.body);
      listener(data);
    });
  }

  unsubscribe(topic) {
    if (this.isConnected) {
      this.client.unsubscribe(topic);
    }
  }

  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
    }
  }
}

export default WebSocketService;
