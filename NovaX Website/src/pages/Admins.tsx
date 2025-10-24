import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Admin {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    username: string;
  };
}

export default function Admins() {
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkOwner = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      
      setIsOwner(data?.username === "Abubakar");
    };

    checkOwner();
  }, [user]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("id, user_id, role")
        .eq("role", "admin");
      
      if (error) {
        console.error("Error fetching admins:", error);
        return;
      }

      if (data && data.length > 0) {
        // Fetch usernames separately
        const userIds = data.map((admin) => admin.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", userIds);

        if (profilesData) {
          const adminsWithProfiles = data.map((admin) => ({
            ...admin,
            profiles: {
              username: profilesData.find((p) => p.id === admin.user_id)?.username || "Unknown"
            }
          }));
          setAdmins(adminsWithProfiles);
        }
      } else {
        setAdmins([]);
      }
    };

    fetchAdmins();

    const channel = supabase
      .channel("user_roles-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_roles"
        },
        () => fetchAdmins()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddAdmin = async () => {
    if (!user || !newAdminUsername.trim()) return;

    // Find user by username
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", newAdminUsername.trim())
      .single();

    if (profileError || !profileData) {
      toast.error("User not found");
      return;
    }

    // Add admin role
    const { error } = await supabase
      .from("user_roles")
      .insert({
        user_id: profileData.id,
        role: "admin"
      });

    if (error) {
      if (error.code === "23505") {
        toast.error("User is already an admin");
      } else {
        toast.error("Failed to add admin");
      }
      console.error(error);
    } else {
      toast.success("Admin added successfully");
      setNewAdminUsername("");
    }
  };

  const handleRemoveAdmin = async (roleId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", roleId);

    if (error) {
      toast.error("Failed to remove admin");
      console.error(error);
    } else {
      toast.success("Admin removed successfully");
    }
  };

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="py-16 text-center">
              <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Access denied. Only the owner can manage admins.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Card className="border-primary/20 bg-card/50 backdrop-blur mb-6 card-hover border-glow">
          <CardHeader>
            <CardTitle className="text-4xl text-glow-intense flex items-center gap-3 justify-center">
              <Shield className="h-10 w-10 text-primary" />
              Admin Management
            </CardTitle>
            <p className="text-center text-muted-foreground">Manage NovaX Clan Administrators</p>
          </CardHeader>
        </Card>

        <Card className="border-primary/20 bg-card/50 backdrop-blur mb-6 card-hover">
          <CardHeader>
            <CardTitle className="text-xl text-glow flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter username"
                value={newAdminUsername}
                onChange={(e) => setNewAdminUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddAdmin()}
                className="bg-background/50 border-primary/20"
              />
              <Button onClick={handleAddAdmin} className="bg-primary hover:bg-primary/90">
                Add Admin
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {admins.length > 0 ? (
            admins.map((admin) => (
              <Card key={admin.id} className="border-primary/20 bg-card/50 backdrop-blur card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="text-lg font-bold text-glow">
                        {admin.profiles.username}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardContent className="py-16 text-center">
                <Shield className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No admins yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
