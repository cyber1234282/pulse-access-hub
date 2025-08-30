import { useState } from "react";
import { CyberHeader } from "@/components/CyberHeader";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { PaymentRequestForm } from "@/components/PaymentRequestForm";
import { ToolkitAccess } from "@/components/ToolkitAccess";
import { useToast } from "@/hooks/use-toast";

type AppState = "login" | "register" | "payment-request" | "pending-approval" | "toolkit-access";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Simulate login (replace with Supabase auth)
    setIsLoggedIn(true);
    setAppState("payment-request");
    toast({
      title: "Access Granted",
      description: "Welcome to BLACK HACKERS TEAM system",
    });
  };

  const handleRegister = (email: string, password: string, confirmPassword: string) => {
    // Simulate registration (replace with Supabase auth)
    setIsLoggedIn(true);
    setAppState("payment-request");
    toast({
      title: "Account Created",
      description: "Registration successful. Submit payment request to continue.",
    });
  };

  const handlePaymentRequest = (request: any) => {
    // Simulate payment request submission (replace with Supabase)
    setAppState("pending-approval");
    toast({
      title: "Payment Request Submitted",
      description: "Your request is pending admin approval",
    });
  };

  // Simulate admin approval (in real app, this would be triggered by admin action)
  const simulateApproval = () => {
    setAppState("toolkit-access");
    toast({
      title: "Payment Approved!",
      description: "Your access has been granted by the admin",
    });
  };

  const renderContent = () => {
    switch (appState) {
      case "login":
        return (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={() => setAppState("register")}
          />
        );
      case "register":
        return (
          <RegisterForm 
            onRegister={handleRegister}
            onSwitchToLogin={() => setAppState("login")}
          />
        );
      case "payment-request":
        return <PaymentRequestForm onSubmitRequest={handlePaymentRequest} />;
      case "pending-approval":
        return (
          <div className="text-center max-w-md mx-auto">
            <div className="bg-card/90 backdrop-blur-sm p-8 rounded-lg border border-secondary/30 pink-glow">
              <h2 className="text-2xl font-bold cyber-text mb-4 uppercase tracking-wider">
                Pending Approval
              </h2>
              <p className="text-accent mb-6">
                Your payment request is being reviewed by the admin
              </p>
              <div className="animate-pulse w-16 h-16 bg-secondary/30 rounded-full mx-auto mb-6" />
              <button
                onClick={simulateApproval}
                className="text-sm text-muted-foreground hover:text-accent"
              >
                (Simulate Admin Approval - Dev Only)
              </button>
            </div>
          </div>
        );
      case "toolkit-access":
        return <ToolkitAccess />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-50" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse" />
      
      <div className="relative z-10">
        <CyberHeader />
        
        <main className="container mx-auto px-6 py-12">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
