import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Flag, AlertCircle } from "lucide-react";

export default function Report() {
  const [reporterUsername, setReporterUsername] = useState("");
  const [reportedPlayer, setReportedPlayer] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to database
      const { error: dbError } = await supabase.from("reports").insert({
        reporter_username: reporterUsername.trim(),
        reported_player: reportedPlayer.trim(),
        reason: reason,
        description: description.trim(),
      });

      if (dbError) throw dbError;

      // Send to Discord webhook
      const { error: webhookError } = await supabase.functions.invoke('submit-report', {
        body: {
          reporterUsername: reporterUsername.trim(),
          reportedPlayer: reportedPlayer.trim(),
          reason: reason,
          description: description.trim(),
        }
      });

      if (webhookError) {
        console.error('Discord webhook error:', webhookError);
        // Don't throw - report was saved to DB
      }

      toast.success("Report submitted successfully! Staff will review it soon.");
      
      // Reset form
      setReporterUsername("");
      setReportedPlayer("");
      setReason("");
      setDescription("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const reportReasons = [
    "Cheating / Hacking",
    "Toxic Behavior",
    "Harassment",
    "Spamming",
    "Inappropriate Name/Avatar",
    "Impersonation",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Card className="max-w-2xl mx-auto border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-glow flex items-center justify-center gap-3">
              <Flag className="h-8 w-8 text-primary" />
              Report a Player
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div className="text-sm text-foreground">
                <p className="font-semibold mb-1">Help us maintain a fair environment</p>
                <p className="text-muted-foreground">
                  Submit detailed reports to help our staff take appropriate action against rule breakers.
                  False reports may result in penalties.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reporterUsername">Your Username</Label>
                <Input
                  id="reporterUsername"
                  value={reporterUsername}
                  onChange={(e) => setReporterUsername(e.target.value)}
                  placeholder="Your in-game name"
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportedPlayer">Reported Player</Label>
                <Input
                  id="reportedPlayer"
                  value={reportedPlayer}
                  onChange={(e) => setReportedPlayer(e.target.value)}
                  placeholder="Name of the player you're reporting"
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Select value={reason} onValueChange={setReason} required>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportReasons.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information about the incident (time, location, what happened, etc.)"
                  required
                  rows={6}
                  className="bg-input border-border resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}