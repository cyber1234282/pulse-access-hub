import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  message_text: string;
  sent_at: string;
  message_type: string;
}

export const NotificationSystem = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing messages
    fetchMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('user-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [newMessage, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast notification
          toast({
            title: "New Message from Admin",
            description: newMessage.message_text.substring(0, 100) + "...",
            duration: 5000,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('user_messages')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setMessages(data);
      setUnreadCount(data.length);
    }
  };

  const handleShowNotifications = () => {
    setShowNotifications(true);
    setUnreadCount(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleShowNotifications}
          variant="outline"
          size="sm"
          className="relative cyber-button"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <div className="fixed top-4 right-4 w-80 max-h-96 overflow-y-auto">
            <Card className="cyber-glow bg-card/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold cyber-text">Admin Messages</h3>
                  <Button
                    onClick={() => setShowNotifications(false)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No messages yet
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className="p-3 bg-muted/50 rounded-lg border border-primary/20"
                      >
                        <p className="text-sm font-medium text-primary mb-1">
                          Admin Broadcast
                        </p>
                        <p className="text-sm text-foreground mb-2">
                          {message.message_text}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(message.sent_at)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};