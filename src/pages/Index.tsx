import { useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { CyberHeader } from "@/components/CyberHeader";
import { AuthPage } from "@/components/AuthPage";
import { PendingApproval } from "@/components/PendingApproval";
import { ToolkitAccess } from "@/components/ToolkitAccess";
import { ContactIcons } from "@/components/ContactIcons";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AppState = "auth" | "pending-approval" | "toolkit-access";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("auth");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile to check approval status
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          setAppState("auth");
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (data) {
      setUserProfile(data);
      // Set app state based on user status
      if (data.status === 'approved') {
        setAppState("toolkit-access");
      } else {
        setAppState("pending-approval");
      }
    } else if (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const handleAuthSuccess = () => {
    // Auth success will be handled by the auth state change listener
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (!user) {
      return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }

    switch (appState) {
      case "pending-approval":
        return <PendingApproval />;
      case "toolkit-access":
        return <ToolkitAccess />;
      default:
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-50" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse" />
      
      {/* Contact Icons - always visible when user is logged in */}
      {user && <ContactIcons />}
      
      <div className="relative z-10">
        {!user && <CyberHeader />}
        
        <main className={user ? "" : "container mx-auto px-6 py-12"}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;