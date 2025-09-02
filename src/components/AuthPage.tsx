import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthState = "login" | "register";

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [authState, setAuthState] = useState<AuthState>("login");
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

    const redirectUrl = `${window.location.origin}/auth/callback`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          email_confirm: true
        }
      }
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created",
        description: "Check your email to verify your account",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {authState === "login" ? (
        <LoginForm 
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthState("register")}
        />
      ) : (
        <RegisterForm 
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthState("login")}
        />
      )}
    </div>
  );
};