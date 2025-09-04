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
    // Fetch unread messages
    fetchUnreadMessages();

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
          
          // Only show if it's not already read by this user
          checkIfMessageRead(newMessage.id).then(isRead => {
            if (!isRead) {
              setMessages(prev => [newMessage, ...prev]);
              setUnreadCount(prev => prev + 1);
              
              // Show popup notification
              toast({
                title: "🔔 New Admin Message",
                description: newMessage.message_text.substring(0, 80) + "...",
                duration: 8000,
              });
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchUnreadMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get messages that haven't been read by this user
    const { data, error } = await supabase
      .from('user_messages')
      .select(`
        *,
        user_message_reads!left(user_id)
      `)
      .is('user_message_reads.user_id', null)
      .order('sent_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setMessages(data);
      setUnreadCount(data.length);
    }
  };

  const checkIfMessageRead = async (messageId: string): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('user_message_reads')
      .select('id')
      .eq('user_id', user.id)
      .eq('message_id', messageId)
      .maybeSingle();

    return !!data;
  };

  const markMessageAsRead = async (messageId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Mark message as read
    await supabase
      .from('user_message_reads')
      .insert({
        user_id: user.id,
        message_id: messageId
      });

    // Remove from local state
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleShowNotifications = () => {
    setShowNotifications(true);
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
                      No new messages
                    </p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className="p-3 bg-muted/50 rounded-lg border border-primary/20 relative group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium text-primary">
                            🔔 Admin Notification
                          </p>
                          <Button
                            onClick={() => markMessageAsRead(message.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-foreground mb-2">
                          {message.message_text}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(message.sent_at)}
                          </p>
                          <Button
                            onClick={() => markMessageAsRead(message.id)}
                            size="sm"
                            variant="outline"
                            className="h-6 text-xs px-2"
                          >
                            Mark as Read
                          </Button>
                        </div>
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