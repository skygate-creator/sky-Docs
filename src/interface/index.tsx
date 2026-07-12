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

export interface RecentClient {
  id?: string;
  name?: string;
  customer_name: string;
  employee_id?: string;
  phone: string;
  trip_price: number;
  avatar_url?: string;
  currency: string;
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
  phone: string;
  trip_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface ClientDocsFormValues {
  client_id: string;
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

export interface Profile {
  id: string;
  name: string;
  email: string;
  profiles?: {
    name: string;
  };
  avatar_url: string | null;
  role: 'admin' | 'employee';
  job_title: string;
  is_active: boolean;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}
