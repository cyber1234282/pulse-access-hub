import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CyberButton } from "./CyberButton";
import { CheckCircle, X } from "lucide-react";
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

  const [showToolkit, setShowToolkit] = useState(false);

  const handleAccessToolkit = () => {
    if (!toolkitUrl) {
      toast({
        title: "Toolkit Unavailable",
        description: "Toolkit URL not configured. Please contact admin.",
        variant: "destructive"
      });
      return;
    }
    
    setShowToolkit(true);
    toast({
      title: "Toolkit Loaded",
      description: "The BLACK HACKERS TEAM toolkit has been loaded securely.",
    });
  };

  const handleCloseToolkit = () => {
    setShowToolkit(false);
  };

  if (showToolkit) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Close button */}
        <div className="absolute top-4 right-4 z-50">
          <CyberButton 
            onClick={handleCloseToolkit}
            className="p-2"
          >
            <X className="w-6 h-6" />
          </CyberButton>
        </div>
        
        {/* Fullscreen iframe */}
        <iframe
          src={toolkitUrl}
          className="w-full h-screen border-0"
          title="BLACK HACKERS TEAM Toolkit"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-downloads"
        />
      </div>
    );
  }

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
            disabled={!toolkitUrl}
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