import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const UpdateMode = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg mx-auto bg-card/90 backdrop-blur-sm border-destructive/30 cyber-glow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-destructive animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold cyber-text uppercase tracking-wider text-destructive">
            System Update
          </CardTitle>
          <p className="text-accent text-lg">
            The system is currently under maintenance
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20">
            <h3 className="text-xl font-bold text-destructive mb-2 uppercase tracking-wide">
              Access Temporarily Restricted
            </h3>
            <p className="text-muted-foreground">
              The BLACK HACKERS TEAM toolkit is currently being updated. Please check back later.
            </p>
          </div>

          <div className="animate-pulse">
            <div className="h-2 bg-destructive/30 rounded-full overflow-hidden">
              <div className="h-full bg-destructive rounded-full animate-[pulse_2s_ease-in-out_infinite]" style={{width: '70%'}}></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wide">
              Updating system components...
            </p>
          </div>

          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Elite updates for elite hackers
          </p>
        </CardContent>
      </Card>
    </div>
  );
};