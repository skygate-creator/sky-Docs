'use client';

import { FormEvent, useMemo, useState } from 'react';
import {
  Eye,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Request } from '@/interface';
import { createClient } from '../../../lib/supabase/client';
import { formatDate } from '../../Utils/date';

interface RequestsTableProps {
  requests: Request[];
  employeeId: string;
}

type ReportFormValues = Pick<
  Request,
  | 'phone'
  | 'destination'
  | 'trip_type'
  | 'passengers'
  | 'departure_airport'
  | 'arrival_airport'
  | 'lead_source'
  | 'customer_notes'
>;

const emptyForm: ReportFormValues = {
  phone: '',
  destination: '',
  trip_type: '',
  passengers: '',
  departure_airport: '',
  arrival_airport: '',
  lead_source: '',
  customer_notes: '',
};

const fieldClass =
  'w-full rounded-xl border border-secondary-200 bg-secondary-50 px-4 py-3 text-14 text-secondary-900 outline-none transition placeholder:text-secondary-300 focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-50';

const RequestsTable = ({ requests, employeeId }: RequestsTableProps) => {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState(requests);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<ReportFormValues>(emptyForm);
  const [editingReport, setEditingReport] = useState<Request | null>(null);
  const [viewingReport, setViewingReport] = useState<Request | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Request | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredRequests = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;

    return items.filter((request) =>
      [request.phone, request.destination, request.trip_type].some((field) =>
        field?.toLowerCase().includes(value),
      ),
    );
  }, [items, search]);

  const openCreate = () => {
    setEditingReport(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEdit = (request: Request) => {
    setEditingReport(request);
    setForm({
      phone: request.phone ?? '',
      destination: request.destination ?? '',
      trip_type: request.trip_type ?? '',
      passengers: request.passengers ?? '',
      departure_airport: request.departure_airport ?? '',
      arrival_airport: request.arrival_airport ?? '',
      lead_source: request.lead_source ?? '',
      customer_notes: request.customer_notes ?? '',
    });
    setIsFormOpen(true);
  };

  const updateField = (field: keyof ReportFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.phone.trim() || !form.destination.trim() || !form.trip_type) {
      toast.error('رقم الهاتف والوجهة ونوع الرحلة بيانات مطلوبة', {
        position: 'top-center',
      });
      return;
    }

    setIsSaving(true);

    const payload = {
      phone: form.phone.trim(),
      destination: form.destination.trim(),
      trip_type: form.trip_type,
      passengers: form.passengers.trim(),
      departure_airport: form.departure_airport.trim(),
      arrival_airport: form.arrival_airport.trim(),
      lead_source: form.lead_source,
      customer_notes: form.customer_notes?.trim() || null,
    };

    try {
      if (editingReport?.id) {
        const { data, error } = await supabase
          .from('requests')
          .update(payload)
          .eq('id', editingReport.id)
          .select('*')
          .single();

        if (error) throw error;

        setItems((current) =>
          current.map((item) => (item.id === data.id ? data : item)),
        );
        toast.success('تم تعديل التقرير بنجاح', { position: 'top-center' });
      } else {
        const { data, error } = await supabase
          .from('requests')
          .insert({
            ...payload,
            employee_id: employeeId,
            dispatcher_id: null,
            is_read: true,
          })
          .select('*')
          .single();

        if (error) throw error;

        setItems((current) => [data, ...current]);
        toast.success('تمت إضافة التقرير بنجاح', { position: 'top-center' });
      }

      setIsFormOpen(false);
      setEditingReport(null);
      setForm(emptyForm);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر حفظ التقرير';
      toast.error(message, { position: 'top-center' });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteReport = async (request: Request) => {
    if (!request.id) return;

    setDeletingId(request.id);

    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', request.id);

      if (error) throw error;

      setItems((current) => current.filter((item) => item.id !== request.id));
      setPendingDelete(null);
      toast.success('تم حذف التقرير', { position: 'top-center' });
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر حذف التقرير';
      toast.error(message, { position: 'top-center' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-secondary-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث برقم الهاتف أو الوجهة"
              className={`${fieldClass} py-2.5 pr-10`}
            />
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-14 font-semibold text-white transition hover:bg-primary-600"
          >
            <Plus className="h-4 w-4" />
            إضافة تقرير
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-secondary-200 bg-secondary-50">
              <tr>
                <th className="px-5 py-4 text-right text-13 font-semibold text-secondary-600">الوجهة</th>
                <th className="px-5 py-4 text-right text-13 font-semibold text-secondary-600">نوع الرحلة</th>
                <th className="px-5 py-4 text-right text-13 font-semibold text-secondary-600">رقم الهاتف</th>
                <th className="px-5 py-4 text-right text-13 font-semibold text-secondary-600">تاريخ الإنشاء</th>
                <th className="px-5 py-4 text-center text-13 font-semibold text-secondary-600">الإجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-secondary-100">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="transition hover:bg-primary-50/50">
                  <td className="px-5 py-4 text-14 font-semibold text-secondary-800">{request.destination}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-primary-100 px-3 py-1 text-12 font-medium text-primary-700">{request.trip_type}</span>
                  </td>
                  <td className="px-5 py-4 text-14 text-secondary-700" dir="ltr">{request.phone}</td>
                  <td className="px-5 py-4 text-14 text-secondary-500">{formatDate(request.created_at)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <ActionButton label="عرض التقرير" onClick={() => setViewingReport(request)} className="text-primary-600 hover:bg-primary-50"><Eye className="h-4 w-4" /></ActionButton>
                      <ActionButton label="تعديل التقرير" onClick={() => openEdit(request)} className="text-secondary-600 hover:bg-secondary-100"><Pencil className="h-4 w-4" /></ActionButton>
                      <ActionButton label="حذف التقرير" onClick={() => setPendingDelete(request)} disabled={deletingId === request.id} className="text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="px-5 py-14 text-center">
            <p className="font-semibold text-secondary-700">{search ? 'لا توجد نتائج مطابقة' : 'لا توجد تقارير حتى الآن'}</p>
            <p className="mt-1 text-13 text-secondary-400">{search ? 'جرّب البحث بكلمة مختلفة' : 'أضف أول تقرير من الزر بالأعلى'}</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/40 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target && !isSaving) setIsFormOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="report-form-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-secondary-100 bg-white px-5 py-4">
              <div>
                <h3 id="report-form-title" className="text-20 font-bold text-secondary-900">{editingReport ? 'تعديل التقرير' : 'إضافة تقرير جديد'}</h3>
                <p className="mt-1 text-13 text-secondary-400">أدخل بيانات الرحلة والعميل ثم احفظ التقرير</p>
              </div>
              <button type="button" onClick={() => setIsFormOpen(false)} disabled={isSaving} aria-label="إغلاق" className="rounded-lg p-2 text-secondary-500 transition hover:bg-secondary-100"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={saveReport} className="p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <ReportField label="رقم هاتف العميل" required>
                  <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className={fieldClass} placeholder="01xxxxxxxxx" inputMode="tel" dir="ltr" />
                </ReportField>
                <ReportField label="الوجهة" required>
                  <input value={form.destination} onChange={(event) => updateField('destination', event.target.value)} className={fieldClass} placeholder="مثال: دبي" />
                </ReportField>
                <ReportField label="نوع الرحلة" required>
                  <select value={form.trip_type} onChange={(event) => updateField('trip_type', event.target.value)} className={fieldClass}>
                    <option value="">اختر نوع الرحلة</option>
                    <option value="برنامج">برنامج</option>
                    <option value="طيران">طيران</option>
                    <option value="فنادق">فنادق</option>
                    <option value="تأشيرات">تأشيرات</option>
                  </select>
                </ReportField>
                <ReportField label="مصدر العميل">
                  <select value={form.lead_source} onChange={(event) => updateField('lead_source', event.target.value)} className={fieldClass}>
                    <option value="">اختر المصدر</option>
                    <option value="انستجرام">انستجرام</option>
                    <option value="تيك توك">تيك توك</option>
                    <option value="واتساب">واتساب</option>
                    <option value="سناب شات">سناب شات</option>
                    <option value="الويبسايت">الويبسايت</option>
                  </select>
                </ReportField>
                <ReportField label="مطار المغادرة">
                  <input value={form.departure_airport} onChange={(event) => updateField('departure_airport', event.target.value)} className={fieldClass} placeholder="مطار المغادرة" />
                </ReportField>
                <ReportField label="مطار الوصول">
                  <input value={form.arrival_airport} onChange={(event) => updateField('arrival_airport', event.target.value)} className={fieldClass} placeholder="مطار الوصول" />
                </ReportField>
                <ReportField label="بيانات المسافرين" className="md:col-span-2">
                  <textarea value={form.passengers} onChange={(event) => updateField('passengers', event.target.value)} className={`${fieldClass} min-h-24 resize-y`} placeholder="مثال: 2 بالغين وطفل" />
                </ReportField>
                <ReportField label="ملاحظات إضافية" className="md:col-span-2">
                  <textarea value={form.customer_notes ?? ''} onChange={(event) => updateField('customer_notes', event.target.value)} className={`${fieldClass} min-h-28 resize-y`} placeholder="الميزانية أو تفضيلات العميل" />
                </ReportField>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-secondary-100 pt-5 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsFormOpen(false)} disabled={isSaving} className="rounded-xl border border-secondary-200 px-5 py-2.5 text-14 font-semibold text-secondary-700 transition hover:bg-secondary-50">إلغاء</button>
                <button type="submit" disabled={isSaving} className="rounded-xl bg-primary-500 px-6 py-2.5 text-14 font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">{isSaving ? 'جاري الحفظ...' : editingReport ? 'حفظ التعديلات' : 'إضافة التقرير'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-950/40 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) setViewingReport(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="report-details-title" className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-primary-500 px-5 py-5 text-white">
              <div>
                <p className="text-12 text-primary-100">تفاصيل التقرير</p>
                <h3 id="report-details-title" className="mt-1 text-24 font-bold">{viewingReport.destination}</h3>
              </div>
              <button type="button" onClick={() => setViewingReport(null)} aria-label="إغلاق" className="rounded-lg p-2 transition hover:bg-white/15"><X className="h-5 w-5" /></button>
            </div>

            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <DetailItem icon={<Phone />} label="رقم الهاتف" value={viewingReport.phone} dir="ltr" />
              <DetailItem icon={<MapPin />} label="الوجهة" value={viewingReport.destination} />
              <DetailItem label="نوع الرحلة" value={viewingReport.trip_type} />
              <DetailItem label="مصدر العميل" value={viewingReport.lead_source || 'غير محدد'} />
              <DetailItem label="مطار المغادرة" value={viewingReport.departure_airport || 'غير محدد'} />
              <DetailItem label="مطار الوصول" value={viewingReport.arrival_airport || 'غير محدد'} />
              <DetailItem icon={<Users />} label="بيانات المسافرين" value={viewingReport.passengers || 'لا توجد بيانات'} className="sm:col-span-2" />
              <DetailItem label="ملاحظات إضافية" value={viewingReport.customer_notes || 'لا توجد ملاحظات'} className="sm:col-span-2" />
            </div>

            <div className="flex items-center justify-between border-t border-secondary-100 px-5 py-4">
              <span className="text-13 text-secondary-400">{formatDate(viewingReport.created_at)}</span>
              <button type="button" onClick={() => { const report = viewingReport; setViewingReport(null); openEdit(report); }} className="inline-flex items-center gap-2 rounded-xl bg-primary-50 px-4 py-2 text-14 font-semibold text-primary-700 transition hover:bg-primary-100"><Pencil className="h-4 w-4" />تعديل التقرير</button>
            </div>
          </div>
        </div>
      )}

      {pendingDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-secondary-950/45 p-4"
          onMouseDown={(event) => {
            if (
              event.currentTarget === event.target &&
              deletingId !== pendingDelete.id
            ) {
              setPendingDelete(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-report-title"
            aria-describedby="delete-report-description"
            className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-2xl"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 className="h-6 w-6" />
            </span>
            <h3
              id="delete-report-title"
              className="mt-4 text-20 font-bold text-secondary-900"
            >
              حذف التقرير؟
            </h3>
            <p
              id="delete-report-description"
              className="mx-auto mt-2 max-w-sm text-14 leading-7 text-secondary-500"
            >
              سيتم حذف تقرير{' '}
              <strong className="text-secondary-800">
                {pendingDelete.destination}
              </strong>{' '}
              نهائيًا، ولا يمكن التراجع عن هذا الإجراء.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deletingId === pendingDelete.id}
                className="rounded-xl border border-secondary-200 px-4 py-2.5 text-14 font-semibold text-secondary-700 transition hover:bg-secondary-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => deleteReport(pendingDelete)}
                disabled={deletingId === pendingDelete.id}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-14 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId === pendingDelete.id ? 'جاري الحذف...' : 'حذف التقرير'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ActionButton = ({ label, children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) => (
  <button type="button" title={label} aria-label={label} className={`rounded-lg p-2 transition disabled:cursor-not-allowed disabled:opacity-40 ${className ?? ''}`} {...props}>{children}</button>
);

const ReportField = ({ label, required, className, children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) => (
  <label className={className}>
    <span className="mb-1.5 block text-13 font-semibold text-secondary-700">{label} {required && <span className="text-red-500">*</span>}</span>
    {children}
  </label>
);

const DetailItem = ({ icon, label, value, className, dir }: { icon?: React.ReactElement; label: string; value: string; className?: string; dir?: 'ltr' | 'rtl' }) => (
  <div className={`rounded-xl border border-secondary-100 bg-secondary-50 p-4 ${className ?? ''}`}>
    <div className="mb-1.5 flex items-center gap-2 text-secondary-400">
      {icon && <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      <span className="text-12 font-medium">{label}</span>
    </div>
    <p className="text-14 font-semibold text-secondary-800" dir={dir}>{value}</p>
  </div>
);

export default RequestsTable;
