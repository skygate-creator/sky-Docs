-- Replace the demo-only client model with a stable customer and repeatable trips.

drop function if exists public.get_total_trip_price();
drop table if exists public.documents;
drop function if exists private.owns_client(uuid);
drop table if exists public.clients;

create sequence if not exists public.customer_code_seq start with 1;

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text not null unique default (
    'SKY-' || lpad(nextval('public.customer_code_seq')::text, 6, '0')
  ),
  employee_id uuid not null default auth.uid()
    references public.profiles(id) on delete restrict,
  customer_name text not null
    check (char_length(btrim(customer_name)) between 3 and 100),
  phone text not null
    check (char_length(btrim(phone)) between 7 and 20),
  phone_normalized text generated always as (
    regexp_replace(phone, '[^0-9]', '', 'g')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_employee_phone_unique unique (employee_id, phone_normalized),
  constraint customers_phone_normalized_length
    check (char_length(phone_normalized) between 7 and 20),
  constraint customers_id_employee_unique unique (id, employee_id)
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null,
  employee_id uuid not null default auth.uid(),
  trip_price numeric not null check (trip_price > 0),
  currency text not null
    check (currency in ('SAR', 'EGP', 'AED', 'USD')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_customer_employee_fkey
    foreign key (customer_id, employee_id)
    references public.customers(id, employee_id)
    on delete cascade
);

create table public.customer_files (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique
    references public.customers(id) on delete cascade,
  passport_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trip_files (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null unique
    references public.trips(id) on delete cascade,
  flight_path text,
  inside_flight_path text,
  voucher_path text,
  car_path text,
  package_path text,
  supplier_info_path text,
  customer_transfers_path text,
  notes text check (notes is null or char_length(notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter sequence public.customer_code_seq owned by public.customers.customer_code;

create index customers_employee_created_idx
  on public.customers(employee_id, created_at desc);
create index trips_customer_created_idx
  on public.trips(customer_id, created_at desc);
create index trips_employee_created_idx
  on public.trips(employee_id, created_at desc);

create trigger customers_set_updated_at
before update on public.customers
for each row execute function private.set_updated_at();

create trigger trips_set_updated_at
before update on public.trips
for each row execute function private.set_updated_at();

create trigger customer_files_set_updated_at
before update on public.customer_files
for each row execute function private.set_updated_at();

create trigger trip_files_set_updated_at
before update on public.trip_files
for each row execute function private.set_updated_at();

create or replace function private.owns_customer(customer_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.customers
    where id = customer_uuid
      and employee_id = (select auth.uid())
  );
$$;

create or replace function private.owns_trip(trip_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.trips
    where id = trip_uuid
      and employee_id = (select auth.uid())
  );
$$;

revoke all on function private.owns_customer(uuid) from public, anon;
revoke all on function private.owns_trip(uuid) from public, anon;
grant execute on function private.owns_customer(uuid) to authenticated;
grant execute on function private.owns_trip(uuid) to authenticated;

alter table public.customers enable row level security;
alter table public.trips enable row level security;
alter table public.customer_files enable row level security;
alter table public.trip_files enable row level security;

create policy "Employees and admins can view customers"
on public.customers for select to authenticated
using (
  ((select private.is_employee()) and employee_id = (select auth.uid()))
  or (select private.is_admin())
);

create policy "Employees can insert own customers"
on public.customers for insert to authenticated
with check (
  (select private.is_employee()) and employee_id = (select auth.uid())
);

create policy "Employees can update own customers"
on public.customers for update to authenticated
using (
  (select private.is_employee()) and employee_id = (select auth.uid())
)
with check (
  (select private.is_employee()) and employee_id = (select auth.uid())
);

create policy "Employees can delete own customers"
on public.customers for delete to authenticated
using (
  (select private.is_employee()) and employee_id = (select auth.uid())
);

create policy "Employees and admins can view trips"
on public.trips for select to authenticated
using (
  ((select private.is_employee()) and employee_id = (select auth.uid()))
  or (select private.is_admin())
);

create policy "Employees can insert own trips"
on public.trips for insert to authenticated
with check (
  (select private.is_employee())
  and employee_id = (select auth.uid())
  and private.owns_customer(customer_id)
);

create policy "Employees can update own trips"
on public.trips for update to authenticated
using (
  (select private.is_employee()) and employee_id = (select auth.uid())
)
with check (
  (select private.is_employee())
  and employee_id = (select auth.uid())
  and private.owns_customer(customer_id)
);

create policy "Employees can delete own trips"
on public.trips for delete to authenticated
using (
  (select private.is_employee()) and employee_id = (select auth.uid())
);

create policy "Employees and admins can view customer files"
on public.customer_files for select to authenticated
using (private.owns_customer(customer_id) or (select private.is_admin()));

create policy "Employees can insert own customer files"
on public.customer_files for insert to authenticated
with check ((select private.is_employee()) and private.owns_customer(customer_id));

create policy "Employees can update own customer files"
on public.customer_files for update to authenticated
using ((select private.is_employee()) and private.owns_customer(customer_id))
with check ((select private.is_employee()) and private.owns_customer(customer_id));

create policy "Employees can delete own customer files"
on public.customer_files for delete to authenticated
using ((select private.is_employee()) and private.owns_customer(customer_id));

create policy "Employees and admins can view trip files"
on public.trip_files for select to authenticated
using (private.owns_trip(trip_id) or (select private.is_admin()));

create policy "Employees can insert own trip files"
on public.trip_files for insert to authenticated
with check ((select private.is_employee()) and private.owns_trip(trip_id));

create policy "Employees can update own trip files"
on public.trip_files for update to authenticated
using ((select private.is_employee()) and private.owns_trip(trip_id))
with check ((select private.is_employee()) and private.owns_trip(trip_id));

create policy "Employees can delete own trip files"
on public.trip_files for delete to authenticated
using ((select private.is_employee()) and private.owns_trip(trip_id));

grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.trips to authenticated;
grant select, insert, update, delete on public.customer_files to authenticated;
grant select, insert, update, delete on public.trip_files to authenticated;
grant usage, select on sequence public.customer_code_seq to authenticated;

create or replace function public.create_customer_with_first_trip(
  p_customer_name text,
  p_phone text,
  p_trip_price numeric,
  p_currency text
)
returns table(customer_id uuid, trip_id uuid, customer_code text)
language plpgsql
set search_path = ''
as $$
declare
  new_customer public.customers;
  new_trip public.trips;
begin
  insert into public.customers (employee_id, customer_name, phone)
  values ((select auth.uid()), btrim(p_customer_name), btrim(p_phone))
  returning * into new_customer;

  insert into public.trips (customer_id, employee_id, trip_price, currency)
  values (
    new_customer.id,
    (select auth.uid()),
    p_trip_price,
    upper(btrim(p_currency))
  )
  returning * into new_trip;

  return query
  select new_customer.id, new_trip.id, new_customer.customer_code;
end;
$$;

create or replace function public.save_trip_files(
  p_customer_id uuid,
  p_trip_id uuid,
  p_passport_path text,
  p_flight_path text,
  p_inside_flight_path text,
  p_voucher_path text,
  p_car_path text,
  p_package_path text,
  p_supplier_info_path text,
  p_customer_transfers_path text,
  p_notes text
)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.trips
    where id = p_trip_id
      and customer_id = p_customer_id
      and employee_id = (select auth.uid())
  ) then
    raise exception 'Trip does not belong to the active employee'
      using errcode = '42501';
  end if;

  insert into public.customer_files (customer_id, passport_path)
  values (p_customer_id, p_passport_path)
  on conflict (customer_id) do update
    set passport_path = excluded.passport_path;

  insert into public.trip_files (
    trip_id,
    flight_path,
    inside_flight_path,
    voucher_path,
    car_path,
    package_path,
    supplier_info_path,
    customer_transfers_path,
    notes
  )
  values (
    p_trip_id,
    p_flight_path,
    p_inside_flight_path,
    p_voucher_path,
    p_car_path,
    p_package_path,
    p_supplier_info_path,
    p_customer_transfers_path,
    p_notes
  )
  on conflict (trip_id) do update set
    flight_path = excluded.flight_path,
    inside_flight_path = excluded.inside_flight_path,
    voucher_path = excluded.voucher_path,
    car_path = excluded.car_path,
    package_path = excluded.package_path,
    supplier_info_path = excluded.supplier_info_path,
    customer_transfers_path = excluded.customer_transfers_path,
    notes = excluded.notes;
end;
$$;

create or replace function public.get_total_trip_price()
returns numeric
language sql
stable
set search_path = ''
as $$
  select coalesce(sum(trip_price), 0)
  from public.trips
  where employee_id = (select auth.uid());
$$;

revoke all on function public.create_customer_with_first_trip(text, text, numeric, text) from public, anon;
revoke all on function public.save_trip_files(uuid, uuid, text, text, text, text, text, text, text, text, text) from public, anon;
revoke all on function public.get_total_trip_price() from public, anon;

grant execute on function public.create_customer_with_first_trip(text, text, numeric, text) to authenticated;
grant execute on function public.save_trip_files(uuid, uuid, text, text, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.get_total_trip_price() to authenticated;

