-- ============================================================
-- 台前 · 数据库契约（h3 冻结）
-- 用法：Supabase Dashboard → SQL Editor → 整段执行
-- 规则：只加不改；要改 = 群里喊 + 地基执笔人执行并同步 lib/types.ts
-- 本文件可重复执行（幂等），跑两遍不会报错
-- ============================================================

-- ---------- 枚举 ----------
do $$ begin create type public.user_role as enum ('host', 'merchant'); exception when duplicate_object then null; end $$;
do $$ begin create type public.work_type as enum ('video', 'image', 'audio'); exception when duplicate_object then null; end $$;
do $$ begin create type public.gig_type as enum ('年会', '发布会', '路演', '展会', '婚礼', '直播', '其他'); exception when duplicate_object then null; end $$;
do $$ begin create type public.gig_status as enum ('open', 'matched', 'closed'); exception when duplicate_object then null; end $$;
do $$ begin create type public.application_initiator as enum ('host', 'merchant'); exception when duplicate_object then null; end $$;
do $$ begin create type public.application_status as enum ('pending', 'accepted', 'rejected'); exception when duplicate_object then null; end $$;

-- ---------- 表 ----------

-- 用户档案：注册即建档（见文末触发器），role 决定整个产品的双端体验
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 主持人档案（role = host 才有）
create table if not exists public.host_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  city text,
  gender text,
  styles text[] not null default '{}',        -- 主持风格标签：婚礼/年会/发布会/路演/展会/直播
  bio text,
  price_hourly integer,
  price_half_day integer,
  price_full_day integer,
  experience_years integer,
  is_verified boolean not null default false,
  rating numeric(2,1) not null default 0,
  rating_count integer not null default 0
);

-- 商家档案（role = merchant 才有）
create table if not exists public.merchant_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  company text,
  industry text,
  intro text,
  is_verified boolean not null default false
);

-- 主持人作品集（video/image/audio，url 指向 Storage 签名地址或外链）
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  type public.work_type not null,
  url text not null,
  title text,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);

-- 商单（商家发布）
create table if not exists public.gigs (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  type public.gig_type not null,
  city text not null,
  event_date date not null,
  duration text not null,                    -- 如：2小时 / 半天 / 全天
  budget_min integer,
  budget_max integer,
  requirements text,
  description text,
  status public.gig_status not null default 'open',
  created_at timestamptz not null default now()
);

-- 报名/邀约（统一表：主持人报名 initiator=host，商家邀约 initiator=merchant）
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  host_id uuid not null references public.profiles(id) on delete cascade,
  initiator public.application_initiator not null,
  status public.application_status not null default 'pending',
  message text,
  created_at timestamptz not null default now()
);

-- 会话（gig_id 为空 = 脱离商单的直接聊天；同一商单同一对人由应用层去重）
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid references public.gigs(id) on delete cascade,
  host_id uuid not null references public.profiles(id) on delete cascade,
  merchant_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 消息（已加入 Realtime publication，聊天订阅这张表的 insert）
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- 评价（24h 版只做展示，写入流为 P1 —— 架构已预留）
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  gig_id uuid not null references public.gigs(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  content text,
  created_at timestamptz not null default now()
);

-- ---------- 注册即建档触发器 ----------
-- signUp 时把 metadata 里的 name/role 落成 profiles + 对应侧档案，
-- 前端注册完即可直接进工作台，无需补一次 insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_role public.user_role;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'host')::public.user_role;

  insert into public.profiles (id, role, name)
  values (
    new.id,
    v_role,
    coalesce(nullif(trim(new.raw_user_meta_data->>'name'), ''), split_part(coalesce(new.email, ''), '@', 1), '新用户')
  );

  if v_role = 'host' then
    insert into public.host_profiles (user_id) values (new.id);
  else
    insert into public.merchant_profiles (user_id) values (new.id);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RLS（基础版：登录可读，本人可写自己的行） ----------

alter table public.profiles enable row level security;
drop policy if exists "profiles 登录可读" on public.profiles;
create policy "profiles 登录可读" on public.profiles for select to authenticated using (true);
drop policy if exists "本人可改资料" on public.profiles;
create policy "本人可改资料" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

alter table public.host_profiles enable row level security;
drop policy if exists "主持人档案登录可读" on public.host_profiles;
create policy "主持人档案登录可读" on public.host_profiles for select to authenticated using (true);
drop policy if exists "本人可建主持人档案" on public.host_profiles;
create policy "本人可建主持人档案" on public.host_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "本人可改主持人档案" on public.host_profiles;
create policy "本人可改主持人档案" on public.host_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.merchant_profiles enable row level security;
drop policy if exists "商家档案登录可读" on public.merchant_profiles;
create policy "商家档案登录可读" on public.merchant_profiles for select to authenticated using (true);
drop policy if exists "本人可建商家档案" on public.merchant_profiles;
create policy "本人可建商家档案" on public.merchant_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "本人可改商家档案" on public.merchant_profiles;
create policy "本人可改商家档案" on public.merchant_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.works enable row level security;
drop policy if exists "作品登录可读" on public.works;
create policy "作品登录可读" on public.works for select to authenticated using (true);
drop policy if exists "本人可传作品" on public.works;
create policy "本人可传作品" on public.works for insert to authenticated with check (auth.uid() = host_id);
drop policy if exists "本人可改作品" on public.works;
create policy "本人可改作品" on public.works for update to authenticated using (auth.uid() = host_id) with check (auth.uid() = host_id);
drop policy if exists "本人可删作品" on public.works;
create policy "本人可删作品" on public.works for delete to authenticated using (auth.uid() = host_id);

alter table public.gigs enable row level security;
drop policy if exists "商单登录可读" on public.gigs;
create policy "商单登录可读" on public.gigs for select to authenticated using (true);
drop policy if exists "本人可发商单" on public.gigs;
create policy "本人可发商单" on public.gigs for insert to authenticated with check (auth.uid() = merchant_id);
drop policy if exists "本人可改商单" on public.gigs;
create policy "本人可改商单" on public.gigs for update to authenticated using (auth.uid() = merchant_id) with check (auth.uid() = merchant_id);
drop policy if exists "本人可删商单" on public.gigs;
create policy "本人可删商单" on public.gigs for delete to authenticated using (auth.uid() = merchant_id);

-- 报名：只有报名的主持人和该商单的商家能看见
alter table public.applications enable row level security;
drop policy if exists "报名相关方可读" on public.applications;
create policy "报名相关方可读" on public.applications for select to authenticated
  using (
    host_id = auth.uid()
    or exists (select 1 from public.gigs g where g.id = gig_id and g.merchant_id = auth.uid())
  );
drop policy if exists "主持人可报名" on public.applications;
create policy "主持人可报名" on public.applications for insert to authenticated
  with check (host_id = auth.uid() and initiator = 'host');
drop policy if exists "商家可邀约" on public.applications;
create policy "商家可邀约" on public.applications for insert to authenticated
  with check (
    initiator = 'merchant'
    and exists (select 1 from public.gigs g where g.id = gig_id and g.merchant_id = auth.uid())
  );
drop policy if exists "报名相关方可改状态" on public.applications;
create policy "报名相关方可改状态" on public.applications for update to authenticated
  using (
    host_id = auth.uid()
    or exists (select 1 from public.gigs g where g.id = gig_id and g.merchant_id = auth.uid())
  )
  with check (
    host_id = auth.uid()
    or exists (select 1 from public.gigs g where g.id = gig_id and g.merchant_id = auth.uid())
  );

-- 会话与消息：只有参与方
alter table public.conversations enable row level security;
drop policy if exists "会话参与方可读" on public.conversations;
create policy "会话参与方可读" on public.conversations for select to authenticated
  using (host_id = auth.uid() or merchant_id = auth.uid());
drop policy if exists "参与方可建会话" on public.conversations;
create policy "参与方可建会话" on public.conversations for insert to authenticated
  with check (host_id = auth.uid() or merchant_id = auth.uid());

alter table public.messages enable row level security;
drop policy if exists "会话参与方可读消息" on public.messages;
create policy "会话参与方可读消息" on public.messages for select to authenticated
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.host_id = auth.uid() or c.merchant_id = auth.uid())
    )
  );
drop policy if exists "参与方可发消息" on public.messages;
create policy "参与方可发消息" on public.messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and (c.host_id = auth.uid() or c.merchant_id = auth.uid())
    )
  );

alter table public.reviews enable row level security;
drop policy if exists "评价登录可读" on public.reviews;
create policy "评价登录可读" on public.reviews for select to authenticated using (true);
drop policy if exists "本人可写评价" on public.reviews;
create policy "本人可写评价" on public.reviews for insert to authenticated with check (reviewer_id = auth.uid());

-- ---------- 索引 ----------
create index if not exists on public.host_profiles (city);
create index if not exists on public.gigs (city);
create index if not exists on public.gigs (status, event_date);
create index if not exists on public.works (host_id);
create index if not exists on public.applications (gig_id);
create index if not exists on public.applications (host_id);
create index if not exists on public.conversations (host_id);
create index if not exists on public.conversations (merchant_id);
create index if not exists on public.messages (conversation_id, created_at);

-- ---------- Realtime（聊天订阅用） ----------
do $$ begin alter publication supabase_realtime add table public.messages; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.conversations; exception when duplicate_object then null; end $$;

-- ---------- Storage：works 公开桶（作品视频/图片） ----------
-- 若这段报权限错误：改为 Dashboard → Storage → New bucket（works，勾 Public），效果一致
insert into storage.buckets (id, name, public) values ('works', 'works', true) on conflict (id) do nothing;
drop policy if exists "works 可公开读" on storage.objects;
create policy "works 可公开读" on storage.objects for select using (bucket_id = 'works');
drop policy if exists "登录用户可传到自己文件夹" on storage.objects;
create policy "登录用户可传到自己文件夹" on storage.objects for insert to authenticated
  with check (bucket_id = 'works' and (storage.foldername(name))[1] = auth.uid()::text);
