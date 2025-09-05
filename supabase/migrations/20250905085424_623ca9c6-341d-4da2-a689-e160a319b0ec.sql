-- Secure admin_settings: admin-only access + safe public view for authenticated users
BEGIN;

-- Create a safe view for non-admin users to access necessary settings
CREATE OR REPLACE VIEW public.public_app_settings AS
SELECT 
  app_update_mode,
  whatsapp_number,
  telegram_link,
  toolkit_url
FROM public.admin_settings
LIMIT 1;

-- Enable RLS on the view
ALTER VIEW public.public_app_settings SET (security_barrier = true);

-- Grant access to authenticated users for the view
GRANT SELECT ON public.public_app_settings TO authenticated;

-- Update admin_settings RLS policies to admin-only access
DROP POLICY IF EXISTS "Anyone can view admin settings" ON public.admin_settings;

-- Recreate admin-only policies
DROP POLICY IF EXISTS "Admins can view admin settings" ON public.admin_settings;
CREATE POLICY "Admins can view admin settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update admin settings" ON public.admin_settings;
CREATE POLICY "Admins can update admin settings"
ON public.admin_settings
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert admin settings" ON public.admin_settings;
CREATE POLICY "Admins can insert admin settings"
ON public.admin_settings
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Keep service role policy for system operations
DROP POLICY IF EXISTS "Service role can manage admin settings" ON public.admin_settings;
CREATE POLICY "Service role can manage admin settings"
ON public.admin_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMIT;