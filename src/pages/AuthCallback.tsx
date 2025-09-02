import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          toast({
            title: "Verification Failed",
            description: "There was an error verifying your email. Please try again.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        if (data.session) {
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. Welcome!",
          });
          navigate("/");
        } else {
          // Handle email confirmation
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
          const type = urlParams.get('type');
          
          if (token && type === 'signup') {
            const { error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'signup'
            });
            
            if (verifyError) {
              console.error("Email verification error:", verifyError);
              toast({
                title: "Verification Failed",
                description: "Email verification failed. Please try again.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Email Verified!",
                description: "Your account has been successfully verified!",
              });
            }
          }
          navigate("/");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred during verification.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg cyber-text">Verifying your email...</p>
      </div>
    </div>
  );
};