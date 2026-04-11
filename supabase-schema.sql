-- Trust None Platform — Supabase Schema
-- Run this in the Supabase SQL Editor

-- Profiles (synced from auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  coin_balance int default 0,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Unlocked episodes
create table user_episodes (
  id bigint primary key generated always as identity,
  user_id uuid references profiles(id) on delete cascade,
  episode_id int not null,
  unlocked_at timestamptz default now(),
  unique(user_id, episode_id)
);

-- Tier purchases
create table user_tiers (
  id bigint primary key generated always as identity,
  user_id uuid references profiles(id) on delete cascade,
  tier_id int not null,
  purchased_at timestamptz default now(),
  unique(user_id, tier_id)
);

-- Watch progress
create table watch_progress (
  id bigint primary key generated always as identity,
  user_id uuid references profiles(id) on delete cascade,
  episode_id int not null,
  seconds_watched int default 0,
  updated_at timestamptz default now(),
  unique(user_id, episode_id)
);

-- Transactions
create table transactions (
  id bigint primary key generated always as identity,
  user_id uuid references profiles(id) on delete cascade,
  type text not null,
  amount decimal(10,2) not null,
  description text,
  stripe_session_id text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table user_episodes enable row level security;
alter table user_tiers enable row level security;
alter table watch_progress enable row level security;
alter table transactions enable row level security;

create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users read own episodes" on user_episodes for select using (auth.uid() = user_id);
create policy "Users insert own episodes" on user_episodes for insert with check (auth.uid() = user_id);
create policy "Users read own tiers" on user_tiers for select using (auth.uid() = user_id);
create policy "Users insert own tiers" on user_tiers for insert with check (auth.uid() = user_id);
create policy "Users manage own progress" on watch_progress for all using (auth.uid() = user_id);
create policy "Users read own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users insert own transactions" on transactions for insert with check (auth.uid() = user_id);
