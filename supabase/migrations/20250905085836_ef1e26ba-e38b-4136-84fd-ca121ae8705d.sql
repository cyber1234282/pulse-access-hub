-- Replace security-definer-like view with a secure table + sync trigger
BEGIN;

-- 1) Drop the existing view if present
DROP VIEW IF EXISTS public.public_app_settings;

-- 2) Create secure table with only safe fields
CREATE TABLE IF NOT EXISTS public.public_app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_update_mode BOOLEAN,
  whatsapp_number TEXT,
  telegram_link TEXT,
  toolkit_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Enable RLS
ALTER TABLE public.public_app_settings ENABLE ROW LEVEL SECURITY;

-- 4) RLS: authenticated can read; only admins can insert/update; service_role can do all
DROP POLICY IF EXISTS "Anyone can view public app settings" ON public.public_app_settings;
DROP POLICY IF EXISTS "Authenticated can view public app settings" ON public.public_app_settings;
CREATE POLICY "Authenticated can view public app settings"
ON public.public_app_settings
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage public app settings" ON public.public_app_settings;
CREATE POLICY "Admins can manage public app settings"
ON public.public_app_settings
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update public app settings"
ON public.public_app_settings
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Service role can manage public app settings" ON public.public_app_settings;
CREATE POLICY "Service role can manage public app settings"
ON public.public_app_settings
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5) Trigger to keep table in sync when admin_settings changes
CREATE OR REPLACE FUNCTION public.sync_public_app_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.public_app_settings (id, app_update_mode, whatsapp_number, telegram_link, toolkit_url)
  VALUES ('00000000-0000-0000-0000-000000000001'::uuid, NEW.app_update_mode, NEW.whatsapp_number, NEW.telegram_link, NEW.toolkit_url)
  ON CONFLICT (id) DO UPDATE SET
    app_update_mode = EXCLUDED.app_update_mode,
    whatsapp_number = EXCLUDED.whatsapp_number,
    telegram_link = EXCLUDED.telegram_link,
    toolkit_url = EXCLUDED.toolkit_url,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_sync_public_app_settings ON public.admin_settings;
CREATE TRIGGER trg_sync_public_app_settings
AFTER INSERT OR UPDATE ON public.admin_settings
FOR EACH ROW EXECUTE FUNCTION public.sync_public_app_settings();

-- 6) updated_at trigger
DROP TRIGGER IF EXISTS trg_update_public_app_settings_updated_at ON public.public_app_settings;
CREATE TRIGGER trg_update_public_app_settings_updated_at
BEFORE UPDATE ON public.public_app_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7) Backfill once from latest admin_settings
INSERT INTO public.public_app_settings (id, app_update_mode, whatsapp_number, telegram_link, toolkit_url)
SELECT '00000000-0000-0000-0000-000000000001'::uuid, app_update_mode, whatsapp_number, telegram_link, toolkit_url
FROM public.admin_settings
ORDER BY created_at DESC
LIMIT 1
ON CONFLICT (id) DO UPDATE SET
  app_update_mode = EXCLUDED.app_update_mode,
  whatsapp_number = EXCLUDED.whatsapp_number,
  telegram_link = EXCLUDED.telegram_link,
  toolkit_url = EXCLUDED.toolkit_url,
  updated_at = now();

COMMIT;