import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";

export default function Rules() {
  const rules = [
    {
      title: "No Cheating or Exploits",
      description:
        "Any form of cheating, hacking, glitch abuse, or third-party tools (aimbot, wallhack, etc.) is strictly prohibited — both in-game and on Discord.",
    },
    {
      title: "Respect Everyone",
      description:
        "Treat all members with respect. No insults, racism, hate speech, or harassment of any kind.",
    },
    {
      title: "No Toxic Behavior",
      description:
        "Toxic attitude, trolling, or provoking fights will not be tolerated. Keep the environment friendly and competitive.",
    },
    {
      title: "No Spamming or Flooding",
      description:
        "Avoid sending repetitive messages, emojis, or links. Use text and voice channels responsibly.",
    },
    {
      title: "Keep Nicknames & Avatars Appropriate",
      description:
        "No offensive names, profile pictures, or clan tags. Staff may request changes if needed.",
    },
    {
      title: "No Advertising / Self-Promotion",
      description:
        "Do not promote your server, YouTube, Discord, or any external content without admin permission.",
    },
    {
      title: "Follow Staff Instructions",
      description:
        "Admins and moderators are here to maintain order. Ignoring or disrespecting them will result in punishment.",
    },
    {
      title: "Keep Voice Chat Clean",
      description:
        "No screaming, soundboards, or loud background noise. Respect others in VC.",
    },
    {
      title: "No Impersonation",
      description:
        "Do not pretend to be staff or another player. Impersonation = instant ban.",
    },
    {
      title: "Keep Content Safe for Everyone",
      description:
        "No NSFW, political, or disturbing content anywhere on the server.",
    },
    {
      title: "Report Rule Breakers",
      description:
        "If you see someone breaking rules, don't start drama — report them to staff privately.",
    },
    {
      title: "Fair Play, Always!",
      description:
        "Play clean, play fair, and represent NovaX with pride. Cheaters ruin the fun for everyone.",
    },
    {
      title: "Have Fun & Build Community",
      description:
        "We're all here for the same reason — to enjoy CoD, make friends, and grow stronger as a clan.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Card className="border-primary/20 bg-card/50 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-glow flex items-center justify-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Server Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
              <p className="text-sm text-foreground">
                Breaking these rules will result in warnings, kicks, or permanent bans
                depending on severity. Read carefully and follow them to ensure a great
                gaming experience for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rules.map((rule, index) => (
                <div
                  key={index}
                  className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-2">{rule.title}</h3>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}