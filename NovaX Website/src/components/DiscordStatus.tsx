import { useState, useEffect } from "react";
import { FaDiscord } from "react-icons/fa";
import { Users, Activity } from "lucide-react";

export const DiscordStatus = () => {
  const [stats, setStats] = useState({ total: 0, online: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscordStats = async () => {
      try {
        // Discord invite code: K7MFhAFy7w
        const response = await fetch(
          "https://discord.com/api/v10/invites/K7MFhAFy7w?with_counts=true"
        );
        const data = await response.json();
        
        setStats({
          total: data.approximate_member_count || 0,
          online: data.approximate_presence_count || 0,
        });
      } catch (error) {
        console.error("Failed to fetch Discord stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchDiscordStats, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card/50 backdrop-blur border border-primary/20 rounded-lg p-4 stat-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-[#5865F2]/20 rounded-lg">
          <FaDiscord className="text-2xl text-[#5865F2]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-glow">Discord Server</h3>
          <p className="text-xs text-muted-foreground">Join our community</p>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-4 bg-primary/10 animate-pulse rounded" />
          <div className="h-4 bg-primary/10 animate-pulse rounded" />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Total Members</span>
            </div>
            <span className="font-bold text-primary text-glow">{stats.total}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Online Now</span>
            </div>
            <span className="font-bold text-green-500 text-glow">{stats.online}</span>
          </div>
        </div>
      )}
      
      <a
        href="https://discord.gg/K7MFhAFy7w"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
      >
        <FaDiscord className="text-lg" />
        Join Server
      </a>
    </div>
  );
};
