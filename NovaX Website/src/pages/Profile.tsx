import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User as UserIcon, Upload, LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      const { data } = await supabase
        .from("profiles")
        .select("username, wallpaper_url")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setWallpaperUrl(data.wallpaper_url || "");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleUploadWallpaper = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/wallpaper.${fileExt}`;

    setUploading(true);

    try {
      const { error: uploadError } = await supabase.storage
        .from('profile-wallpapers')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-wallpapers')
        .getPublicUrl(filePath);

      setWallpaperUrl(publicUrl);
      toast.success("Wallpaper uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload wallpaper");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: username.trim(),
          wallpaper_url: wallpaperUrl,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Card className="max-w-2xl mx-auto border-primary/20 bg-card/50 backdrop-blur card-hover">
          <CardHeader>
            <CardTitle className="text-3xl text-glow-intense flex items-center gap-3">
              <UserIcon className="h-8 w-8 text-primary" />
              Edit Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {wallpaperUrl && (
              <div className="w-full h-48 rounded-lg overflow-hidden border border-primary/30">
                <img
                  src={wallpaperUrl}
                  alt="Profile Wallpaper"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallpaper">Profile Wallpaper</Label>
                <div className="flex gap-2">
                  <Input
                    id="wallpaper"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadWallpaper}
                    disabled={uploading}
                    className="bg-input border-border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="border-primary/50"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a custom wallpaper for your profile
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:opacity-90 flex-1"
                  disabled={loading || uploading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
