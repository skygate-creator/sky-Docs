// validation/clientSchema.ts
import * as Yup from 'yup';
// employee validation page
export const clientValidationSchema = Yup.object({
  customer_name: Yup.string()
    .trim()
    .min(3, 'الاسم لازم يكون 3 أحرف على الأقل')
    .max(100, 'الاسم طويل جداً')
    .required('اسم العميل مطلوب'),

  phone: Yup.string()
    .trim()
    .min(7, 'رقم الهاتف قصير جداً')
    .max(15, 'رقم الهاتف طويل جداً')
    .required('رقم الهاتف مطلوب'),

  trip_price: Yup.number()
    .typeError('السعر لازم يكون رقم')
    .positive('السعر لازم يكون أكبر من صفر')
    .required('سعر الرحلة مطلوب'),

  currency: Yup.string().required('العملة مطلوبة'),
});

// validation/dispatcherRequestSchema.ts

export const dispatcherRequestSchema = Yup.object({
  employee_id: Yup.string().required('الموظف مطلوب'),

  phone: Yup.string()
    .trim()
    .min(7, 'رقم الهاتف قصير جداً')
    .max(15, 'رقم الهاتف طويل جداً')
    .required('رقم الهاتف مطلوب'),

  trip_type: Yup.string().required('نوع الرحلة مطلوب'),

  lead_source: Yup.string().required('مصدر العميل مطلوب'),
});
