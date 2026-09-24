create type public.animal_species as enum ('dog', 'cat');
create type public.animal_status as enum ('available', 'on_hold', 'adoption_pending', 'adopted', 'archived');
create type public.animal_size as enum ('small', 'medium', 'large');
create type public.energy_level as enum ('low', 'medium', 'high');
create type public.application_status as enum ('draft', 'submitted', 'under_review', 'appointment_requested', 'appointment_scheduled', 'approved', 'rejected', 'completed');
create type public.appointment_status as enum ('requested', 'confirmed', 'completed', 'cancelled', 'no_show');
create type public.notification_status as enum ('queued', 'sent', 'failed');

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.role_assignments
    where user_id = auth.uid() and role = 'staff'
  );
$$;

create table public.applicant_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  location text,
  household_summary text,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint applicant_profiles_full_name_length check (full_name is null or char_length(full_name) <= 160),
  constraint applicant_profiles_phone_length check (phone is null or char_length(phone) <= 40)
);

create table public.animals (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid() references auth.users (id),
  name text not null,
  species public.animal_species not null,
  breed text,
  sex text,
  age_years numeric(4,1),
  size public.animal_size not null,
  weight_kg numeric(5,1),
  location text,
  description text not null default '',
  personality text not null default '',
  energy_level public.energy_level not null,
  good_with_children boolean not null default false,
  good_with_dogs boolean not null default false,
  good_with_cats boolean not null default false,
  house_trained boolean not null default false,
  medical_status text not null default '',
  vaccination_status text not null default '',
  sterilized boolean not null default false,
  special_care text not null default '',
  adoption_restrictions text not null default '',
  status public.animal_status not null default 'available',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint animals_name_length check (char_length(name) between 1 and 120),
  constraint animals_age_nonnegative check (age_years is null or age_years >= 0),
  constraint animals_weight_nonnegative check (weight_kg is null or weight_kg >= 0)
);

create table public.animal_photos (
  id uuid primary key default gen_random_uuid(),
  animal_id uuid not null references public.animals (id) on delete cascade,
  storage_path text not null,
  public_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.questionnaire_answers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint questionnaire_answers_object check (jsonb_typeof(answers) = 'object')
);

create table public.compatibility_results (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users (id) on delete cascade,
  animal_id uuid not null references public.animals (id) on delete cascade,
  score numeric(5,2) not null,
  eligible boolean not null,
  reasons jsonb not null default '[]'::jsonb,
  calculated_at timestamptz not null default timezone('utc', now()),
  unique (applicant_id, animal_id),
  constraint compatibility_score_range check (score between 0 and 100)
);

create table public.adoption_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users (id) on delete cascade,
  animal_id uuid not null references public.animals (id),
  status public.application_status not null default 'draft',
  applicant_message text not null default '',
  staff_notes text not null default '',
  reviewed_by uuid references auth.users (id),
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.adoption_applications (id) on delete cascade,
  applicant_id uuid not null references auth.users (id) on delete cascade,
  requested_start timestamptz not null,
  requested_end timestamptz not null,
  status public.appointment_status not null default 'requested',
  applicant_notes text not null default '',
  staff_notes text not null default '',
  outlook_event_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint appointments_valid_range check (requested_end > requested_start)
);

create table public.email_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users (id) on delete cascade,
  notification_type text not null,
  subject text not null,
  body text not null,
  status public.notification_status not null default 'queued',
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users (id) on delete cascade,
  animal_id uuid references public.animals (id) on delete set null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint ai_conversations_messages_array check (jsonb_typeof(messages) = 'array')
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

create trigger applicant_profiles_set_updated_at before update on public.applicant_profiles for each row execute function public.set_updated_at();
create trigger animals_set_updated_at before update on public.animals for each row execute function public.set_updated_at();
create trigger questionnaire_answers_set_updated_at before update on public.questionnaire_answers for each row execute function public.set_updated_at();
create trigger adoption_applications_set_updated_at before update on public.adoption_applications for each row execute function public.set_updated_at();
create trigger appointments_set_updated_at before update on public.appointments for each row execute function public.set_updated_at();
create trigger ai_conversations_set_updated_at before update on public.ai_conversations for each row execute function public.set_updated_at();

alter table public.applicant_profiles enable row level security;
alter table public.animals enable row level security;
alter table public.animal_photos enable row level security;
alter table public.questionnaire_answers enable row level security;
alter table public.compatibility_results enable row level security;
alter table public.adoption_applications enable row level security;
alter table public.appointments enable row level security;
alter table public.email_notifications enable row level security;
alter table public.ai_conversations enable row level security;

grant select, insert, update on public.applicant_profiles to authenticated;
grant select, insert, update, delete on public.animals to authenticated;
grant select, insert, update, delete on public.animal_photos to authenticated;
grant select, insert, update on public.questionnaire_answers to authenticated;
grant select, insert, update on public.compatibility_results to authenticated;
grant select, insert, update on public.adoption_applications to authenticated;
grant select, insert, update on public.appointments to authenticated;
grant select on public.email_notifications to authenticated;
grant select, insert, update on public.ai_conversations to authenticated;

create policy applicant_profiles_own on public.applicant_profiles for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy applicant_profiles_staff_select on public.applicant_profiles for select to authenticated using (public.is_staff());
create policy animals_visible_to_applicants on public.animals for select to authenticated using (public.is_staff() or status in ('available', 'on_hold', 'adoption_pending'));
create policy animals_staff_write on public.animals for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy animal_photos_visible_to_users on public.animal_photos for select to authenticated using (public.is_staff() or exists (select 1 from public.animals where animals.id = animal_id and animals.status in ('available', 'on_hold', 'adoption_pending')));
create policy animal_photos_staff_write on public.animal_photos for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy questionnaire_answers_own on public.questionnaire_answers for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy compatibility_results_own_or_staff on public.compatibility_results for select to authenticated using (auth.uid() = applicant_id or public.is_staff());
create policy compatibility_results_own_write on public.compatibility_results for insert to authenticated with check (auth.uid() = applicant_id);
create policy compatibility_results_own_update on public.compatibility_results for update to authenticated using (auth.uid() = applicant_id) with check (auth.uid() = applicant_id);
create policy applications_own_or_staff_select on public.adoption_applications for select to authenticated using (auth.uid() = applicant_id or public.is_staff());
create policy applications_own_insert on public.adoption_applications for insert to authenticated with check (auth.uid() = applicant_id);
create policy applications_own_update on public.adoption_applications for update to authenticated using (auth.uid() = applicant_id and status = 'draft') with check (auth.uid() = applicant_id);
create policy applications_staff_update on public.adoption_applications for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy appointments_own_or_staff_select on public.appointments for select to authenticated using (auth.uid() = applicant_id or public.is_staff());
create policy appointments_own_insert on public.appointments for insert to authenticated with check (auth.uid() = applicant_id and exists (select 1 from public.adoption_applications where id = application_id and applicant_id = auth.uid()));
create policy appointments_own_update on public.appointments for update to authenticated using (auth.uid() = applicant_id and status = 'requested') with check (auth.uid() = applicant_id);
create policy appointments_staff_update on public.appointments for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy notifications_own_select on public.email_notifications for select to authenticated using (auth.uid() = recipient_id or public.is_staff());
create policy ai_conversations_own on public.ai_conversations for all to authenticated using (auth.uid() = applicant_id) with check (auth.uid() = applicant_id);

create or replace function public.queue_application_notification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.email_notifications (recipient_id, notification_type, subject, body)
    values (new.applicant_id, 'application_status', 'Your adoption application was updated', 'Your application status is now: ' || replace(new.status::text, '_', ' ') || '.');
  end if;
  return new;
end;
$$;

create trigger adoption_application_status_notification
after update of status on public.adoption_applications
for each row execute function public.queue_application_notification();

create or replace function public.sync_appointment_application_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.adoption_applications
    set status = 'appointment_requested'
    where id = new.application_id and status in ('submitted', 'under_review');
  elsif new.status is distinct from old.status then
    if new.status = 'confirmed' then
      update public.adoption_applications set status = 'appointment_scheduled' where id = new.application_id;
    elsif new.status = 'completed' then
      update public.adoption_applications set status = 'completed' where id = new.application_id;
    end if;
    insert into public.email_notifications (recipient_id, notification_type, subject, body)
    values (new.applicant_id, 'appointment_status', 'Your appointment was updated', 'Your appointment status is now: ' || replace(new.status::text, '_', ' ') || '.');
  end if;
  return new;
end;
$$;

create trigger appointment_insert_status_sync
after insert on public.appointments
for each row execute function public.sync_appointment_application_status();

create trigger appointment_update_status_sync
after update of status on public.appointments
for each row execute function public.sync_appointment_application_status();

insert into storage.buckets (id, name, public)
values ('animal-photos', 'animal-photos', true)
on conflict (id) do nothing;

create policy animal_photos_public_read on storage.objects for select using (bucket_id = 'animal-photos');
create policy animal_photos_staff_insert on storage.objects for insert to authenticated with check (bucket_id = 'animal-photos' and public.is_staff());
create policy animal_photos_staff_update on storage.objects for update to authenticated using (bucket_id = 'animal-photos' and public.is_staff()) with check (bucket_id = 'animal-photos' and public.is_staff());
create policy animal_photos_staff_delete on storage.objects for delete to authenticated using (bucket_id = 'animal-photos' and public.is_staff());
