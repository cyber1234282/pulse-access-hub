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
  const { toast } = useToast();

  useEffect(() => {
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
        async (payload) => {
          const newMessage = payload.new as Message;
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Check if message is already read
            const { data: readData } = await supabase
              .from('user_message_reads')
              .select('id')
              .eq('user_id', user.id)
              .eq('message_id', newMessage.id)
              .maybeSingle();

            // Only show if not already read
            if (!readData) {
              // Show push notification only
              toast({
                title: "🔔 New Admin Message",
                description: newMessage.message_text,
                duration: 10000,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // No longer need persistent notification UI - only push notifications
  return null;
};