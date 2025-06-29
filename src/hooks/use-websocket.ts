"use client";

import { useState, useEffect, useCallback } from 'react';
import { Client, type IMessage, type IFrame, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = '/ws';

interface UseWebSocketOptions {
  onConnect?: (frame: IFrame) => void;
  onDisconnect?: () => void;
  onError?: (frame: IFrame) => void;
}

export function useWebSocket({ onConnect, onDisconnect, onError }: UseWebSocketOptions = {}) {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      debug: (str) => {
        // console.log(new Date(), str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame: IFrame) => {
      setIsConnected(true);
      console.log('Connected: ' + frame);
      if (onConnect) onConnect(frame);
    };

    client.onStompError = (frame: IFrame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      if(onError) onError(frame);
    };
    
    client.onDisconnect = () => {
      setIsConnected(false);
      console.log('Disconnected');
      if(onDisconnect) onDisconnect();
    };
    
    client.activate();
    setStompClient(client);
  }, [onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (stompClient?.connected) {
      stompClient.deactivate();
    }
  }, [stompClient]);

  const subscribe = useCallback((topic: string, callback: (message: IMessage) => void): StompSubscription | undefined => {
    if (stompClient?.connected) {
      return stompClient.subscribe(topic, callback);
    }
    return undefined;
  }, [stompClient]);
  
  const publish = useCallback((destination: string, body: string) => {
    if (stompClient?.connected) {
      stompClient.publish({ destination, body });
    } else {
        console.error("Cannot publish: Not connected to WebSocket.");
    }
  }, [stompClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stompClient?.active) {
        stompClient.deactivate();
      }
    };
  }, [stompClient]);

  return { connect, disconnect, subscribe, publish, isConnected, client: stompClient };
}
