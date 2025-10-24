import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function Announcements() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();
        
        setIsAdmin(data?.username === "Abubakar");
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();
        
        setIsAdmin(data?.username === "Abubakar");
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      
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

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create announcements");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("announcements").insert({
        title: title.trim(),
        content: content.trim(),
        author_id: user.id,
      });

      if (error) throw error;

      toast.success("Announcement created successfully!");
      setTitle("");
      setContent("");
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user || !isAdmin) return;
    
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete announcement");
      console.error(error);
    } else {
      toast.success("Announcement deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Card className="border-primary/20 bg-card/50 backdrop-blur mb-6 card-hover border-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl text-glow-intense flex items-center gap-3">
                <Megaphone className="h-8 w-8 text-primary" />
                Announcements
              </CardTitle>
              {isAdmin && (
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-gradient-primary hover:opacity-90 border-glow"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Announcement
                </Button>
              )}
            </div>
          </CardHeader>

          {showForm && isAdmin && (
            <CardContent className="border-t border-border pt-6">
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Announcement title"
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Announcement content"
                    required
                    rows={4}
                    className="bg-input border-border resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-primary hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Announcement"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-primary/50 hover:bg-primary/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="border-primary/20 bg-card/50 backdrop-blur card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-glow">{announcement.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {new Date(announcement.created_at).toLocaleDateString()} at{" "}
                        {new Date(announcement.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(announcement.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="py-12 text-center">
                <Megaphone className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No announcements yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}