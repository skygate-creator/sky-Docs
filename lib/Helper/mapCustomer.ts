import { ClientDetails, RecentClient, Trip } from '@/interface';

type RawCustomer = Omit<
  RecentClient,
  'trip_price' | 'currency' | 'trips' | 'trips_count'
> & {
  trips?: Trip[] | null;
  customer_files?: RecentClient['customer_files'] | RecentClient['customer_files'][];
};

const sortTrips = (trips: Trip[] | null | undefined) =>
  [...(trips ?? [])].sort(
    (first, second) =>
      new Date(second.created_at).getTime() - new Date(first.created_at).getTime(),
  );

export const mapCustomer = (customer: RawCustomer): RecentClient => {
  const trips = sortTrips(customer.trips);
  const latestTrip = trips[0];
  const customerFiles = Array.isArray(customer.customer_files)
    ? customer.customer_files[0] ?? null
    : customer.customer_files ?? null;

  return {
    ...customer,
    trips,
    trips_count: trips.length,
    trip_price: Number(latestTrip?.trip_price ?? 0),
    currency: latestTrip?.currency ?? 'SAR',
    latest_trip_at: latestTrip?.created_at,
    customer_files: customerFiles,
  };
};

export const mapCustomerDetails = (customer: RawCustomer): ClientDetails =>
  mapCustomer(customer) as ClientDetails;
