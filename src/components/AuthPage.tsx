import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { VerificationForm } from "./VerificationForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthState = "login" | "register" | "verify";

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [authState, setAuthState] = useState<AuthState>("login");
  const [verificationData, setVerificationData] = useState<{ email: string; userId: string } | null>(null);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Access Granted",
        description: "Welcome to BLACK HACKERS TEAM system",
      });
      onAuthSuccess();
    }
  };

  const handleRegister = async (email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    try {
      // Send OTP using our custom edge function
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, userId: 'temp_id' }
      });

      if (error) {
        throw error;
      }

      // Set verification data for OTP verification
      setVerificationData({ email, userId: 'temp_id' });
      setAuthState("verify");
      
      toast({
        title: "Verification Code Sent",
        description: "Please check your email for a 6-digit verification code.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed", 
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    }
  };

  const handleVerificationSuccess = () => {
    toast({
      title: "Account Verified!",
      description: "Your account has been verified. You can now log in.",
    });
    setAuthState("login");
    setVerificationData(null);
  };

  const handleBackFromVerification = () => {
    setAuthState("register");
    setVerificationData(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {authState === "login" ? (
        <LoginForm 
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthState("register")}
        />
      ) : authState === "register" ? (
        <RegisterForm 
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthState("login")}
        />
      ) : authState === "verify" && verificationData ? (
        <VerificationForm
          email={verificationData.email}
          userId={verificationData.userId}
          onVerified={handleVerificationSuccess}
          onBack={handleBackFromVerification}
        />
      ) : null}
    </div>
  );
};