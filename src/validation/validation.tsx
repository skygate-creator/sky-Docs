// validation/clientSchema.ts
import * as Yup from 'yup';

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
