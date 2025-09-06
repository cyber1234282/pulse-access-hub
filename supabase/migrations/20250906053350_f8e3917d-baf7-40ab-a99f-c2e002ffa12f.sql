-- Create verification_codes table for custom OTP flow (fixed)
create extension if not exists pgcrypto;

create table if not exists public.verification_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  code text not null,
  expires_at timestamptz not null,
  used_at timestamptz null,
  created_at timestamptz not null default now()
);

-- Enable RLS (edge functions use service role and bypass RLS)
alter table public.verification_codes enable row level security;

-- Helpful indexes
create index if not exists idx_verification_codes_user_id on public.verification_codes (user_id);
create index if not exists idx_verification_codes_email_code on public.verification_codes (email, code);
create index if not exists idx_verification_codes_expires_at on public.verification_codes (expires_at);