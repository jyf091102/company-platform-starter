create table if not exists public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  contact_name text not null check (char_length(contact_name) between 1 and 100),
  work_email text not null check (char_length(work_email) <= 254),
  company_name text not null check (char_length(company_name) between 1 and 160),
  region text check (char_length(region) <= 100),
  industry text check (char_length(industry) <= 80),
  company_size text check (company_size in ('1–9 人','10–49 人','50–249 人','250 人以上')),
  service_needs text check (char_length(service_needs) <= 1200),
  preferred_contact text not null default 'email' check (preferred_contact in ('email','phone','portal')),
  preferred_time text check (char_length(preferred_time) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (char_length(subject) <= 160),
  summary text not null check (char_length(summary) between 1 and 800),
  language text not null default 'zh-CN' check (char_length(language) <= 20),
  status text not null default 'new' check (status in ('new','assigned','waiting_customer','resolved')),
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_requests_user_created_idx on public.support_requests(user_id, created_at desc);
create index if not exists support_requests_status_created_idx on public.support_requests(status, created_at desc);

alter table public.customer_profiles enable row level security;
alter table public.support_requests enable row level security;

create policy "customers read own business profile" on public.customer_profiles for select to authenticated
using ((select auth.uid()) = user_id);
create policy "customers create own business profile" on public.customer_profiles for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "customers update own business profile" on public.customer_profiles for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "customers read own support requests" on public.support_requests for select to authenticated
using ((select auth.uid()) = user_id);
create policy "customers create own support requests" on public.support_requests for insert to authenticated
with check ((select auth.uid()) = user_id and assigned_to is null and status = 'new');

create policy "staff read customer profiles" on public.customer_profiles for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'staff') = 'true');
create policy "staff read support queue" on public.support_requests for select to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'staff') = 'true');
create policy "staff update support queue" on public.support_requests for update to authenticated
using ((select auth.jwt() -> 'app_metadata' ->> 'staff') = 'true')
with check ((select auth.jwt() -> 'app_metadata' ->> 'staff') = 'true');

grant select, insert, update on public.customer_profiles to authenticated;
grant select, insert, update on public.support_requests to authenticated;
grant usage, select on sequence public.support_requests_id_seq to authenticated;
