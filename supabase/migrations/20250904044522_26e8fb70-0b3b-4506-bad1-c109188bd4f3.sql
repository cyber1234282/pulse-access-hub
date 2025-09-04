-- Create user message reads table to track which messages users have read
CREATE TABLE IF NOT EXISTS public.user_message_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_id UUID NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, message_id)
);

-- Enable RLS
ALTER TABLE public.user_message_reads ENABLE ROW LEVEL SECURITY;

-- Create policies for message reads
CREATE POLICY "Users can view their own message reads" 
ON public.user_message_reads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own message reads" 
ON public.user_message_reads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add foreign key to user_messages
ALTER TABLE public.user_message_reads 
ADD CONSTRAINT fk_user_message_reads_message_id 
FOREIGN KEY (message_id) REFERENCES public.user_messages(id) ON DELETE CASCADE;