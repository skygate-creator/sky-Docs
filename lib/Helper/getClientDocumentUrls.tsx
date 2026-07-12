// lib/Helper/getClientDocumentsSignedUrls.ts

import { createClient } from '../supabase/server';

const BUCKET_NAME = 'documents';
const EXPIRY_SECONDS = 60 * 60; // ساعة

interface DocumentPaths {
  flight_path: string | null;
  inside_flight_path: string | null;
  voucher_path: string | null;
  car_path: string | null;
  package_path: string | null;
  passport_path: string | null;
  supplier_info_path: string | null;
  customer_transfers_path: string | null;
}

interface SignedDocumentUrls {
  flight_path: string | null;
  inside_flight_path: string | null;
  voucher_path: string | null;
  car_path: string | null;
  package_path: string | null;
  passport_path: string | null;
  supplier_info_path: string | null;
  customer_transfers_path: string | null;
}

const getClientDocumentsSignedUrls = async (
  documents: DocumentPaths,
): Promise<SignedDocumentUrls> => {
  const supabase = await createClient();

  const fields = [
    'flight_path',
    'inside_flight_path',
    'voucher_path',
    'car_path',
    'package_path',
    'passport_path',
    'supplier_info_path',
    'customer_transfers_path',
  ] as const;

  const result: SignedDocumentUrls = {
    flight_path: null,
    inside_flight_path: null,
    voucher_path: null,
    car_path: null,
    package_path: null,
    passport_path: null,
    supplier_info_path: null,
    customer_transfers_path: null,
  };

  await Promise.all(
    fields.map(async (field) => {
      const path = documents[field];

      if (!path) return;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(path, EXPIRY_SECONDS);

      if (error) return;

      result[field] = data.signedUrl;
    }),
  );

  return result;
};

export default getClientDocumentsSignedUrls;
