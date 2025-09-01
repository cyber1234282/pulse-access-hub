-- Remove all existing admin roles
DELETE FROM public.user_roles WHERE role = 'admin';

-- Add the two specific admins
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'
FROM public.profiles 
WHERE email IN ('hinjutech2@gmail.com', 'thecybertest27@gmail.com');

-- Add columns for app update mode and messaging
ALTER TABLE public.admin_settings
ADD COLUMN app_update_mode boolean DEFAULT false,
ADD COLUMN last_message_sent text,
ADD COLUMN message_sent_at timestamp with time zone;

-- Create a table for storing user messages
CREATE TABLE public.user_messages (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    message_text text NOT NULL,
    sent_by uuid REFERENCES auth.users(id),
    sent_at timestamp with time zone NOT NULL DEFAULT now(),
    message_type text DEFAULT 'broadcast'
);

-- Enable RLS on user_messages
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for user_messages
CREATE POLICY "Anyone can view messages" 
ON public.user_messages 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can send messages" 
ON public.user_messages 
FOR INSERT 
WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
));