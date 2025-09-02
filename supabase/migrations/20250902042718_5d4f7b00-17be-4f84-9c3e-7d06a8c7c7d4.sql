-- Enable realtime for user_messages table
ALTER TABLE public.user_messages REPLICA IDENTITY FULL;

-- Add user_messages to realtime publication  
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_messages;