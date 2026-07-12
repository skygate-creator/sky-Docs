import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatArabicDate = (date: string | Date) => {
  return format(new Date(date), 'd MMMM yyyy', { locale: ar });
};
