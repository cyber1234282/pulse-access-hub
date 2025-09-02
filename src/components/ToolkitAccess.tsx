import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CyberButton } from "./CyberButton";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ToolkitAccess = () => {
  const [toolkitUrl, setToolkitUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    fetchToolkitUrl();
  }, []);

  const fetchToolkitUrl = async () => {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('toolkit_url')
      .limit(1)
      .maybeSingle();

    if (data?.toolkit_url) {
      setToolkitUrl(data.toolkit_url);
    }
  };

  const handleAccessToolkit = () => {
    if (!toolkitUrl) {
      toast({
        title: "Toolkit Not Available",
        description: "The admin hasn't configured the toolkit URL yet. Please contact support.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Ensure the URL is properly formatted
      const url = toolkitUrl.trim();
      console.log("Opening toolkit URL:", url);
      
      // Open the URL in a new tab
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");
      
      if (!newWindow) {
        toast({
          title: "Popup Blocked",
          description: "Please allow popups for this site and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Toolkit Opened",
          description: "The toolkit has been opened in a new tab.",
        });
      }
    } catch (error) {
      console.error("Error opening toolkit:", error);
      toast({
        title: "Error",
        description: "Failed to open the toolkit. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg mx-auto bg-card/90 backdrop-blur-sm border-primary/30 cyber-glow">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-primary cyber-glow" />
          </div>
          <CardTitle className="text-3xl font-bold cyber-text uppercase tracking-wider">
            Access Granted
          </CardTitle>
          <p className="text-accent text-lg">
            Your payment has been approved by the admin
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-6 bg-muted/50 rounded-lg border border-primary/20">
            <h3 className="text-xl font-bold text-primary mb-2 uppercase tracking-wide">
              Toolkit Ready
            </h3>
            <p className="text-muted-foreground">
              Click the button below to access the BLACK HACKERS TEAM toolkit
            </p>
          </div>

          <CyberButton 
            onClick={handleAccessToolkit}
            className="w-full text-xl py-6 animate-pulse"
          >
            Access Toolkit
          </CyberButton>

          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Elite tools for elite hackers
          </p>
        </CardContent>
      </Card>
    </div>
  );
};