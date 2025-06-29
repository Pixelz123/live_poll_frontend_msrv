"use client";

import { useEffect, useState } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const SOCKET_URL = 'http://localhost:8080/ws'; // TODO: Replace with your SockJS endpoint

export default function WebSocketTestPage() {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [topic, setTopic] = useState('/topic/greetings');
    const [messageToSend, setMessageToSend] = useState('{"name": "Test"}');
    const [destination, setDestination] = useState('/app/hello');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Disconnect on component unmount
        return () => {
            if (stompClient?.connected) {
                stompClient.deactivate();
            }
        };
    }, [stompClient]);

    const connect = () => {
        const client = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            debug: (str) => {
                console.log(new Date(), str);
                setMessages(prev => [...prev, `DEBUG: ${str}`]);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            setIsConnected(true);
            setMessages(prev => [...prev, `Connected: ${frame}`]);
            
            client.subscribe(topic, (message: IMessage) => {
                setMessages(prev => [...prev, `Received from ${topic}: ${message.body}`]);
            });
        };

        client.onStompError = (frame) => {
            setIsConnected(false);
            setMessages(prev => [...prev, `Broker reported error: ${frame.headers['message']}`]);
            setMessages(prev => [...prev, `Additional details: ${frame.body}`]);
        };
        
        client.onDisconnect = () => {
            setIsConnected(false);
            setMessages(prev => [...prev, 'Disconnected']);
        };
        
        client.activate();
        setStompClient(client);
    };

    const disconnect = () => {
        if (stompClient?.connected) {
            stompClient.deactivate();
        }
    };
    
    const sendMessage = () => {
        if (stompClient?.connected && destination) {
            stompClient.publish({ destination, body: messageToSend });
            setMessages(prev => [...prev, `Sent to ${destination}: ${messageToSend}`]);
        } else {
            setMessages(prev => [...prev, `Error: Not connected or no destination set.`]);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
             <Link href="/" className="absolute top-4 left-4 text-primary hover:underline">
                &larr; Back to Home
            </Link>
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>WebSocket (SockJS + STOMP) Test</CardTitle>
                    <CardDescription>
                        Connect to a WebSocket server, subscribe to a topic, and send messages.
                        Make sure your STOMP over SockJS server is running at {SOCKET_URL}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Button onClick={connect} disabled={isConnected}>Connect</Button>
                        <Button onClick={disconnect} disabled={!isConnected} variant="destructive">Disconnect</Button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="topic">Topic to Subscribe</Label>
                        <Input id="topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="/topic/your-topic" />
                    </div>

                    <div className="space-y-2">
                         <Label htmlFor="destination">Destination to Send To</Label>
                        <Input id="destination" value={destination} onChange={e => setDestination(e.target.value)} placeholder="/app/your-endpoint"/>
                        <Label htmlFor="message">Message Body (JSON string)</Label>
                        <div className="flex gap-2">
                           <Input id="message" value={messageToSend} onChange={e => setMessageToSend(e.target.value)} />
                           <Button onClick={sendMessage} disabled={!isConnected}>Send</Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Log</Label>
                        <Textarea className="h-64 font-mono text-xs" value={messages.join('\n')} readOnly />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
