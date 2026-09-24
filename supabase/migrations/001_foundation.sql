create type public.user_role as enum ('applicant', 'staff');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_display_name_length check (display_name is null or char_length(display_name) <= 120)
);

create table public.role_assignments (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger role_assignments_set_updated_at
before update on public.role_assignments
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, null);

  insert into public.role_assignments (user_id, role)
  values (new.id, 'applicant');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.role_assignments enable row level security;

revoke all on public.profiles from anon;
revoke all on public.role_assignments from anon;
grant select, update on public.profiles to authenticated;
grant select on public.role_assignments to authenticated;

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy role_assignments_select_own
on public.role_assignments
for select
to authenticated
using (auth.uid() = user_id);

comment on table public.profiles is 'Basic user profile data; authorization is stored separately.';
comment on table public.role_assignments is 'Trusted authorization source of truth; browser clients cannot write roles.';
