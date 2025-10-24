import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Users, Map, Gamepad2 } from "lucide-react";

interface ServerInfo {
  online: boolean;
  name: string;
  map?: string;
  players?: number;
  maxPlayers?: number;
  gameType?: string;
  message?: string;
}

export const ServerStatus = () => {
  const [serverInfo, setServerInfo] = useState<ServerInfo>({
    online: false,
    name: "NovaX | Clan",
    message: "Checking status..."
  });

  const fetchServerStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('server-status');
      
      if (error) throw error;
      
      setServerInfo(data);
    } catch (error) {
      console.error('Error fetching server status:', error);
      setServerInfo({
        online: false,
        name: "NovaX | Clan",
        message: "Unable to fetch status"
      });
    }
  };

  useEffect(() => {
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Server Status</h3>
          <div className="flex items-center space-x-2">
            <Activity className={`h-5 w-5 ${serverInfo.online ? 'text-green-500 animate-pulse' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${serverInfo.online ? 'text-green-500' : 'text-red-500'}`}>
              {serverInfo.online ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <Gamepad2 className="h-5 w-5" />
            <span className="text-sm">IP: 5.39.63.207:7919</span>
          </div>

          {serverInfo.online && serverInfo.players !== undefined && (
            <>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span className="text-sm">
                  Players: {serverInfo.players}/{serverInfo.maxPlayers}
                </span>
              </div>

              {serverInfo.map && (
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Map className="h-5 w-5" />
                  <span className="text-sm">Map: {serverInfo.map}</span>
                </div>
              )}

              {serverInfo.gameType && (
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Gamepad2 className="h-5 w-5" />
                  <span className="text-sm">Mode: {serverInfo.gameType}</span>
                </div>
              )}
            </>
          )}

          {!serverInfo.online && serverInfo.message && (
            <p className="text-sm text-muted-foreground">{serverInfo.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};