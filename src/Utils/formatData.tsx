'use client';
import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatDate = (date?: string | Date | null) => {
  if (!date) return '-';

  const currentDate = new Date(date);

  const days = differenceInDays(new Date(), currentDate);

  if (days < 7) {
    return formatDistanceToNowStrict(currentDate, {
      addSuffix: true,
      locale: ar,
    });
  }

  return format(currentDate, 'dd MMMM yyyy', {
    locale: ar,
  });
};
