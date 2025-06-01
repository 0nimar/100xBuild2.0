'use client';

import { useEffect, useState } from 'react';

export function Counter() {
  const [activeConnections, setActiveConnections] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws/counter');

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setActiveConnections(data.activeConnections);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      <span>{activeConnections} active</span>
    </div>
  );
} 