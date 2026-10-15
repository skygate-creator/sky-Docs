import { LucideIcon } from 'lucide-react';

export interface aside {
  name: string;
  icon: LucideIcon;
  href: string;
}

export interface AddClientForm {
  customer_name: string;
  phone: string;
  trip_price: number;
  currency: string;
}

export interface Trip {
  id: string;
  customer_id: string;
  employee_id: string;
  trip_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerFile {
  id?: string;
  customer_id?: string;
  passport_path: string | null;
}

export interface RecentClient {
  id?: string;
  name?: string;
  customer_name: string;
  customer_code: string;
  employee_id?: string;
  phone: string;
  trip_price: number;
  avatar_url?: string;
  currency: string;
  trips: Trip[];
  trips_count: number;
  latest_trip_at?: string;
  customer_files?: CustomerFile | null;
  profiles?: {
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ClientDetails {
  id: string;
  employee_id: string;
  customer_name: string;
  customer_code: string;
  phone: string;
  trip_price: number;
  currency: string;
  trips: Trip[];
  trips_count: number;
  latest_trip_at?: string;
  customer_files?: CustomerFile | null;
  created_at: string;
  updated_at: string;
}

export interface ClientDocsFormValues {
  customer_id: string;
  trip_id: string;
  flight_path: File | null;
  voucher_path: File | null;
  car_path: File | null;
  package_path: File | null;
  passport_path: File | null;
  inside_flight_path: File | null;
  supplier_info_path: File | null;
  customer_transfers_path: File | null;
  notes: string;
}

export interface TripFiles {
  id?: string;
  trip_id?: string;
  flight_path: string | null;
  voucher_path: string | null;
  car_path: string | null;
  package_path: string | null;
  inside_flight_path: string | null;
  supplier_info_path: string | null;
  customer_transfers_path: string | null;
  notes: string | null;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  profiles?: {
    name: string;
  };
  avatar_url: string | null;
  role: 'admin' | 'employee' | 'dispatcher';
  job_title: string;
  is_active: boolean;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmployeeDirectoryItem extends Profile {
  clients_count: number;
  requests_count: number;
}

export interface Request {
  id?: string;
  dispatcher_id?: string | null;
  employee_id: string;
  phone: string;
  destination: string;
  trip_type: string;
  passengers: string;
  departure_airport: string;
  arrival_airport: string;
  lead_source: string;
  customer_notes: string | null;
  is_read?: boolean;
  created_at?: string;
}

//  user in dispacher
export interface UserDispatcher {
  id: string;
  name: string;
}
