-- Add toolkit_url to admin_settings table
ALTER TABLE public.admin_settings 
ADD COLUMN toolkit_url TEXT;