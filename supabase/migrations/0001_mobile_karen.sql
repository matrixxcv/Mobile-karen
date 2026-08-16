create extension if not exists "pgcrypto";

create type public.user_role as enum ('customer','admin');
create type public.order_status as enum ('pending','paid','processing','shipped','completed','cancelled');
create type public.payment_status as enum ('unpaid','pending','paid','failed','refunded');

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text,
 phone text,
 role public.user_role not null default 'customer',
 created_at timestamptz not null default now()
);

create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 slug text unique not null,
 name text not null,
 category text not null default 'iphone',
 description text,
 price bigint not null default 0,
 compare_at_price bigint,
 stock integer not null default 0,
 image_url text,
 specs jsonb not null default '{}'::jsonb,
 colors jsonb not null default '[]'::jsonb,
 storage_options jsonb not null default '[]'::jsonb,
 active boolean not null default true,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete restrict,
 status public.order_status not null default 'pending',
 payment_status public.payment_status not null default 'unpaid',
 total_amount bigint not null default 0,
 customer_name text not null,
 phone text not null,
 address text,
 postal_code text,
 payment_authority text,
 payment_ref_id text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.orders(id) on delete cascade,
 product_id uuid references public.products(id) on delete set null,
 name_snapshot text not null,
 unit_price bigint not null,
 quantity integer not null check (quantity > 0),
 variant jsonb not null default '{}'::jsonb
);

create table if not exists public.repairs (
 id uuid primary key default gen_random_uuid(),
 user_id uuid references auth.users(id) on delete set null,
 tracking_code text unique not null default ('MK-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
 customer_name text not null,
 phone text not null,
 device text not null,
 issue text not null,
 notes text,
 status text not null default 'received',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

create table if not exists public.vpn_services (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 protocol text not null check (protocol in ('SSH','NPV')),
 duration_days integer not null,
 price bigint not null,
 stock integer not null default 0,
 connection_data text,
 active boolean not null default true,
 created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,full_name) values(new.id,new.raw_user_meta_data->>'full_name')
 on conflict (id) do nothing;
 return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.repairs enable row level security;
alter table public.vpn_services enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role='admin');
$$;

drop policy if exists "public active products" on public.products;
create policy "public active products" on public.products for select using (active=true or public.is_admin());
drop policy if exists "admin products" on public.products;
create policy "admin products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using (id=auth.uid() or public.is_admin());
create policy "update own profile" on public.profiles for update using (id=auth.uid()) with check (id=auth.uid());
create policy "admin profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "own orders" on public.orders for select using (user_id=auth.uid() or public.is_admin());
create policy "create own orders" on public.orders for insert with check (user_id=auth.uid());
create policy "admin orders" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "own order items" on public.order_items for select using (
 exists(select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.is_admin()))
);
create policy "create own order items" on public.order_items for insert with check (
 exists(select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid())
);
create policy "admin order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());

create policy "own repairs" on public.repairs for select using (user_id=auth.uid() or public.is_admin());
create policy "create repairs" on public.repairs for insert with check (user_id=auth.uid() or user_id is null);
create policy "admin repairs" on public.repairs for all using (public.is_admin()) with check (public.is_admin());

create policy "public vpn catalog" on public.vpn_services for select using (active=true or public.is_admin());
create policy "admin vpn" on public.vpn_services for all using (public.is_admin()) with check (public.is_admin());

insert into public.vpn_services(name,protocol,duration_days,price,stock)
select * from (values
 ('SSH یک ماهه','SSH',30,0,0),
 ('SSH سه ماهه','SSH',90,0,0),
 ('NPV یک ماهه','NPV',30,0,0),
 ('NPV سه ماهه','NPV',90,0,0)
) v(name,protocol,duration_days,price,stock)
where not exists (select 1 from public.vpn_services);
