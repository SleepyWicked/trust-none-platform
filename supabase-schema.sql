-- Trust None (the movie) — Supabase schema
-- Run in the Supabase SQL Editor. Safe to re-run.
--
-- Security model: browsers can only READ their own purchases. Purchases are
-- written exclusively by the Stripe webhook using the service role key, so
-- nobody can grant themselves the movie from the browser console.

-- Profiles (synced from auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  created_at timestamptz default now()
);

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Purchases: film rentals/purchases and shop orders, one row per paid Stripe session.
create table if not exists purchases (
  id bigint primary key generated always as identity,
  user_id uuid references profiles(id) on delete set null,
  email text,
  kind text not null check (kind in ('rent', 'buy', 'product')),
  product_id text,
  amount_cents int not null default 0,
  expires_at timestamptz,          -- set for rentals only
  shipping jsonb,                  -- physical orders only
  stripe_session_id text not null unique,
  created_at timestamptz default now()
);
create index if not exists purchases_user_idx on purchases (user_id);

-- Newsletter signups (written by /api/subscribe with the service role)
create table if not exists email_signups (
  id bigint primary key generated always as identity,
  email text not null unique,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table purchases enable row level security;
alter table email_signups enable row level security;

drop policy if exists "Users read own profile" on profiles;
drop policy if exists "Users update own profile" on profiles;
create policy "Users read own profile" on profiles for select using (auth.uid() = id);

drop policy if exists "Users read own purchases" on purchases;
create policy "Users read own purchases" on purchases for select using (auth.uid() = user_id);

-- No insert/update/delete policies on purchases or email_signups: with RLS on,
-- only the service role (server) can write them.

-- ---------------------------------------------------------------------------
-- Upgrading a database created from the old series schema? The old tables
-- (user_episodes, user_tiers, watch_progress, transactions, site_settings)
-- belong to the series platform and are no longer used here. At minimum,
-- remove the browser write policies that let users grant themselves content:
--
--   drop policy if exists "Users insert own episodes" on user_episodes;
--   drop policy if exists "Users insert own tiers" on user_tiers;
--   drop policy if exists "Users insert own transactions" on transactions;
--   alter table profiles drop column if exists coin_balance;
-- ---------------------------------------------------------------------------
