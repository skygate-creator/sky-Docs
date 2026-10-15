drop index if exists public.trips_customer_created_idx;

create index trips_customer_employee_created_idx
  on public.trips(customer_id, employee_id, created_at desc);
