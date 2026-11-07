-- 台前 TAIQIAN · Supabase schema + RLS
-- 本地 demo 目前用 data/db.json；这份 SQL 是切 Supabase 时的迁移底稿。
-- 在 Supabase SQL Editor 里按顺序执行。

create extension if not exists "pgcrypto";

-- ---------- users ----------

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('host', 'merchant')),
  name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id);

-- 注册后自动建 public.users（role/name 从 auth metadata 读取）
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, role, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'host'),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- host_profiles ----------

create table if not exists public.host_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  city text,
  gender text,
  styles text[] not null default '{}',
  bio text,
  tagline text,
  price_hourly int not null default 0,
  price_half_day int not null default 0,
  price_full_day int not null default 0,
  experience_years int not null default 0,
  is_verified boolean not null default false,
  rating numeric not null default 0,
  rating_count int not null default 0,
  response_minutes int not null default 30,
  tone text not null default 'sand',
  availability jsonb not null default '[]'::jsonb
);

alter table public.host_profiles enable row level security;

create policy "host_profiles_public_read"
  on public.host_profiles for select
  using (true);

create policy "host_profiles_insert_own"
  on public.host_profiles for insert
  with check (auth.uid() = user_id);

create policy "host_profiles_update_own"
  on public.host_profiles for update
  using (auth.uid() = user_id);

-- ---------- merchant_profiles ----------

create table if not exists public.merchant_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  company text,
  industry text,
  intro text,
  verified boolean not null default false
);

alter table public.merchant_profiles enable row level security;

create policy "merchant_profiles_public_read"
  on public.merchant_profiles for select
  using (true);

create policy "merchant_profiles_insert_own"
  on public.merchant_profiles for insert
  with check (auth.uid() = user_id);

create policy "merchant_profiles_update_own"
  on public.merchant_profiles for update
  using (auth.uid() = user_id);

-- ---------- works ----------

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.users(id) on delete cascade,
  type text not null check (type in ('video', 'image', 'audio')),
  url text not null,
  title text not null,
  duration text,
  tone text not null default 'ink',
  created_at timestamptz not null default now()
);

alter table public.works enable row level security;

create policy "works_public_read"
  on public.works for select
  using (true);

create policy "works_insert_own"
  on public.works for insert
  with check (auth.uid() = host_id);

create policy "works_update_own"
  on public.works for update
  using (auth.uid() = host_id);

create policy "works_delete_own"
  on public.works for delete
  using (auth.uid() = host_id);

-- ---------- gigs ----------

create table if not exists public.gigs (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.users(id) on delete cascade,
  company text not null,
  title text not null,
  type text not null check (type in ('婚礼', '年会', '发布会', '路演', '展会', '直播')),
  city text not null,
  event_date date not null,
  duration text not null,
  budget_min int not null,
  budget_max int not null,
  requirements text[] not null default '{}',
  description text,
  status text not null default 'open' check (status in ('open', 'matched', 'closed')),
  applicants int not null default 0,
  posted_at date not null default current_date,
  tone text not null default 'gold',
  created_at timestamptz not null default now()
);

alter table public.gigs enable row level security;

create policy "gigs_public_read"
  on public.gigs for select
  using (true);

create policy "gigs_insert_own"
  on public.gigs for insert
  with check (auth.uid() = merchant_id);

create policy "gigs_update_own"
  on public.gigs for update
  using (auth.uid() = merchant_id);

create policy "gigs_delete_own"
  on public.gigs for delete
  using (auth.uid() = merchant_id);

-- ---------- applications ----------

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid references public.gigs(id) on delete set null,
  host_id uuid not null references public.users(id) on delete cascade,
  merchant_id uuid not null references public.users(id) on delete cascade,
  initiator text not null check (initiator in ('host', 'merchant')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create policy "applications_participant_read"
  on public.applications for select
  using (auth.uid() = host_id or auth.uid() = merchant_id);

create policy "applications_host_insert"
  on public.applications for insert
  with check (auth.uid() = host_id and initiator = 'host');

create policy "applications_merchant_insert"
  on public.applications for insert
  with check (auth.uid() = merchant_id and initiator = 'merchant');

create policy "applications_participant_update"
  on public.applications for update
  using (auth.uid() = host_id or auth.uid() = merchant_id);

-- ---------- conversations ----------

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid references public.gigs(id) on delete set null,
  host_id uuid not null references public.users(id) on delete cascade,
  merchant_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create policy "conversations_participant_read"
  on public.conversations for select
  using (auth.uid() = host_id or auth.uid() = merchant_id);

create policy "conversations_participant_insert"
  on public.conversations for insert
  with check (auth.uid() = host_id or auth.uid() = merchant_id);

create unique index if not exists conversations_gig_pair_idx
  on public.conversations (gig_id, host_id, merchant_id)
  where gig_id is not null;

-- ---------- messages ----------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  content text not null check (char_length(content) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create or replace function public.is_conversation_member(c_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.conversations c
    where c.id = c_id
      and (c.host_id = auth.uid() or c.merchant_id = auth.uid())
  );
$$;

create policy "messages_member_read"
  on public.messages for select
  using (public.is_conversation_member(conversation_id));

create policy "messages_member_insert"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and public.is_conversation_member(conversation_id)
  );

-- ---------- reviews ----------

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid references public.gigs(id) on delete set null,
  reviewer_id uuid not null references public.users(id) on delete cascade,
  reviewee_id uuid not null references public.users(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  content text,
  merchant text,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "reviews_public_read"
  on public.reviews for select
  using (true);

create policy "reviews_insert_own"
  on public.reviews for insert
  with check (auth.uid() = reviewer_id);

-- ---------- indexes ----------

create index if not exists gigs_status_idx on public.gigs (status);
create index if not exists gigs_city_type_idx on public.gigs (city, type);
create index if not exists applications_host_idx on public.applications (host_id, status);
create index if not exists applications_merchant_idx on public.applications (merchant_id, status);
create index if not exists messages_conversation_idx on public.messages (conversation_id, created_at);
create index if not exists works_host_idx on public.works (host_id);

-- ---------- storage（作品视频 / 图片） ----------

insert into storage.buckets (id, name, public)
values ('works', 'works', true)
on conflict (id) do nothing;

create policy "works_bucket_read"
  on storage.objects for select
  using (bucket_id = 'works');

create policy "works_bucket_upload"
  on storage.objects for insert
  with check (bucket_id = 'works' and auth.role() = 'authenticated');

-- ---------- grants ----------

grant usage on schema public to anon, authenticated;
grant select on public.host_profiles, public.merchant_profiles, public.works, public.gigs, public.reviews to anon, authenticated;
grant select, insert, update on public.users, public.host_profiles, public.merchant_profiles, public.works, public.gigs, public.applications, public.conversations, public.messages to authenticated;
grant select on public.applications, public.conversations, public.messages to authenticated;
