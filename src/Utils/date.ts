import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatDate = (date?: string | Date | null) => {
  if (!date) return '-';

  const currentDate = new Date(date);
  if (Number.isNaN(currentDate.getTime())) return '-';

  const days = differenceInDays(new Date(), currentDate);

  if (days < 7) {
    return formatDistanceToNowStrict(currentDate, {
      addSuffix: true,
      locale: ar,
    });
  }

  return format(currentDate, 'dd MMMM yyyy', { locale: ar });
};

export const formatMonthYear = (date: string | Date) =>
  new Intl.DateTimeFormat('ar-EG', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

export const formatLongDate = (
  date?: string | Date | null,
  fallback = 'غير محدد',
) => {
  if (!date) return fallback;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return fallback;

  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsedDate);
};
