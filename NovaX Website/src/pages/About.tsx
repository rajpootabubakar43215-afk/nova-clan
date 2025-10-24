import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Shield, Sword, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Card className="border-primary/20 bg-card/50 backdrop-blur mb-6 card-hover border-glow-intense">
          <CardHeader>
            <CardTitle className="text-4xl text-glow-intense flex items-center gap-3 justify-center">
              <Crown className="h-10 w-10 text-primary" />
              About Owner - Abubakar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-primary flex items-center justify-center border-4 border-primary/50 shadow-glow">
                <Crown className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-glow">Abubakar</h2>
              <p className="text-muted-foreground text-lg">Founder & Leader of NovaX Clan</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card/30 border-primary/30 card-hover">
                <CardContent className="pt-6 text-center space-y-3">
                  <Shield className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold text-glow">Leadership</h3>
                  <p className="text-muted-foreground">
                    Building a strong, competitive gaming community with honor and respect
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-primary/30 card-hover">
                <CardContent className="pt-6 text-center space-y-3">
                  <Sword className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold text-glow">Excellence</h3>
                  <p className="text-muted-foreground">
                    Striving for the highest standards in gameplay and sportsmanship
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/30 border-primary/30 card-hover">
                <CardContent className="pt-6 text-center space-y-3">
                  <Target className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold text-glow">Vision</h3>
                  <p className="text-muted-foreground">
                    Creating the most dominant Call of Duty 1.1 clan in the community
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/30 border-primary/30">
              <CardHeader>
                <CardTitle className="text-xl text-glow">About NovaX Clan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  NovaX Clan was founded with a vision to create a premier gaming community 
                  for Call of Duty 1.1 enthusiasts. Under the leadership of Abubakar, 
                  we have grown into a respected clan known for our competitive spirit 
                  and fair play.
                </p>
                <p>
                  Our server (5.39.63.207:7919) provides a platform for players to 
                  showcase their skills, compete in tournaments, and forge lasting 
                  friendships with fellow gamers who share the same passion for CoD 1.1.
                </p>
                <p className="text-primary font-semibold">
                  Join us today and become part of the NovaX legacy!
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
