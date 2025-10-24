import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { DiscordStatus } from "@/components/DiscordStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Shield, Flag, Megaphone, Server, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function Index() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (data) setAnnouncements(data);
    };

    fetchAnnouncements();

    const channel = supabase
      .channel("announcements-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements"
        },
        () => fetchAnnouncements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroBg})`
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial opacity-50"></div>
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-glow-intense">
            NovaX | Clan
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Elite Call of Duty 1.1 Gaming Community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 border-glow">
                Join Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 text-lg px-8">
                Live Chat
                <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Server Info & Stats Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-primary/20 bg-card/50 backdrop-blur card-hover stat-card">
            <CardContent className="p-6 text-center">
              <Server className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-glow mb-2">Server</h3>
              <p className="text-muted-foreground text-sm mb-3">NovaX | Clan</p>
              <div className="space-y-2">
                <p className="text-foreground font-mono text-lg">5.39.63.207:7919</p>
                <p className="text-xs text-muted-foreground">Call of Duty 1.1</p>
              </div>
            </CardContent>
          </Card>

          <DiscordStatus />

          <Card className="border-primary/20 bg-card/50 backdrop-blur card-hover stat-card">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-glow mb-2">Join Us</h3>
              <p className="text-muted-foreground text-sm mb-3">Become a NovaX Member</p>
              <Link to="/auth">
                <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Announcements */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur card-hover border-glow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-glow">
              <Megaphone className="h-7 w-7 text-primary" />
              Latest Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary/30 transition-colors">
                  <h4 className="font-bold text-foreground mb-2">{announcement.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No announcements yet</p>
            )}
            <Link to="/announcements">
              <Button variant="outline" className="w-full border-primary/50 hover:bg-primary/10">
                View All Announcements
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Access Grid */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur card-hover border-glow">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-glow mb-6 text-center">Quick Access</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Link to="/rules" className="block">
                <Button variant="outline" className="w-full h-24 flex-col gap-2 border-primary/50 hover:bg-primary/10 card-hover">
                  <Shield className="h-8 w-8" />
                  Server Rules
                </Button>
              </Link>
              <Link to="/announcements" className="block">
                <Button variant="outline" className="w-full h-24 flex-col gap-2 border-primary/50 hover:bg-primary/10 card-hover">
                  <Megaphone className="h-8 w-8" />
                  Announcements
                </Button>
              </Link>
              <Link to="/report" className="block">
                <Button variant="outline" className="w-full h-24 flex-col gap-2 border-primary/50 hover:bg-primary/10 card-hover">
                  <Flag className="h-8 w-8" />
                  Report Player
                </Button>
              </Link>
              <Link to="/chat" className="block">
                <Button variant="outline" className="w-full h-24 flex-col gap-2 border-primary/50 hover:bg-primary/10 card-hover">
                  <MessageSquare className="h-8 w-8" />
                  Live Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}