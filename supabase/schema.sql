create extension if not exists pgcrypto;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null default '',
    saving_goal numeric not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    unique (user_id, name)
);

create table if not exists public.transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    description text not null,
    category_id uuid references public.categories(id) on delete set null,
    category_name text not null,
    amount numeric not null,
    type text not null check (type in ('income', 'expense')),
    confirmed boolean not null default true,
    transaction_date date not null,
    month_index integer not null check (month_index between 0 and 11),
    created_at timestamptz not null default now()
);

create table if not exists public.category_budgets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    category_id uuid not null references public.categories(id) on delete cascade,
    month_index integer not null check (month_index between 0 and 11),
    budget numeric not null default 0,
    created_at timestamptz not null default now(),
    unique (user_id, category_id, month_index)
);

create table if not exists public.opening_balances (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    month_index integer not null check (month_index between 0 and 11),
    amount numeric not null default 0,
    currency text not null default 'BRL',
    created_at timestamptz not null default now(),
    unique (user_id, month_index)
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.category_budgets enable row level security;
alter table public.opening_balances enable row level security;

create policy "profiles_select_own" on public.profiles
    for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
    for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
    for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "categories_manage_own" on public.categories
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transactions_manage_own" on public.transactions
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "category_budgets_manage_own" on public.category_budgets
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "opening_balances_manage_own" on public.opening_balances
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
