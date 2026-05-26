-- Questions, workspace files, submissions, runs, and assistant chat

create type public.file_kind as enum ('starter', 'readonly', 'hidden_test');
create type public.submission_status as enum ('in_progress', 'passed');
create type public.chat_role as enum ('user', 'assistant');

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  tags text[] not null default '{}',
  language text not null default 'java',
  spec_md text not null,
  time_limit_min int,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.question_files (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  path text not null,
  content text not null,
  kind public.file_kind not null default 'starter',
  unique (question_id, path)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  status public.submission_status not null default 'in_progress',
  files jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create table public.submission_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  submission_id uuid references public.submissions (id) on delete set null,
  passed int not null default 0,
  total int not null default 0,
  results jsonb not null default '[]',
  stdout text,
  duration_ms int,
  created_at timestamptz not null default now()
);

create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads (id) on delete cascade,
  role public.chat_role not null,
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index questions_published_idx on public.questions (published) where published = true;
create index submission_runs_user_created_idx on public.submission_runs (user_id, created_at desc);
create index chat_messages_thread_created_idx on public.chat_messages (thread_id, created_at);

alter table public.questions enable row level security;
alter table public.question_files enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_runs enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

create policy "questions_select_published"
  on public.questions for select to authenticated
  using (published = true);

create policy "question_files_select_visible"
  on public.question_files for select to authenticated
  using (
    kind in ('starter', 'readonly')
    and exists (
      select 1 from public.questions q
      where q.id = question_id and q.published = true
    )
  );

create policy "submissions_select_own"
  on public.submissions for select to authenticated
  using (auth.uid() = user_id);

create policy "submissions_insert_own"
  on public.submissions for insert to authenticated
  with check (auth.uid() = user_id);

create policy "submissions_update_own"
  on public.submissions for update to authenticated
  using (auth.uid() = user_id);

create policy "submission_runs_select_own"
  on public.submission_runs for select to authenticated
  using (auth.uid() = user_id);

create policy "submission_runs_insert_own"
  on public.submission_runs for insert to authenticated
  with check (auth.uid() = user_id);

create policy "chat_threads_select_own"
  on public.chat_threads for select to authenticated
  using (auth.uid() = user_id);

create policy "chat_threads_insert_own"
  on public.chat_threads for insert to authenticated
  with check (auth.uid() = user_id);

create policy "chat_messages_select_own"
  on public.chat_messages for select to authenticated
  using (
    exists (
      select 1 from public.chat_threads t
      where t.id = thread_id and t.user_id = auth.uid()
    )
  );

create policy "chat_messages_insert_own"
  on public.chat_messages for insert to authenticated
  with check (
    exists (
      select 1 from public.chat_threads t
      where t.id = thread_id and t.user_id = auth.uid()
    )
  );
