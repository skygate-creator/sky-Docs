import { LucideIcon } from 'lucide-react';

const colorStyles = {
  blue: 'bg-primary-50 text-primary-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-tertiary-50 text-tertiary-600',
  green: 'bg-green-50 text-green-700',
};

interface StatCardProps {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  color: keyof typeof colorStyles;
  compactValue?: boolean;
  density?: 'default' | 'compact';
}

const StatCard = ({
  label,
  value,
  note,
  icon: Icon,
  color,
  compactValue = false,
  density = 'default',
}: StatCardProps) => {
  const isCompact = density === 'compact';

  return (
    <article
      className={`flex items-center rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm ${
        isCompact ? 'min-h-28 gap-3' : 'min-h-32 gap-4'
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl ${colorStyles[color]} ${
          isCompact ? 'h-11 w-11' : 'h-12 w-12'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p
          className={`${isCompact ? 'text-11' : 'text-12'} font-medium text-secondary-400`}
        >
          {label}
        </p>
        <strong
          className={`mt-1 block font-bold text-secondary-950 ${
            compactValue ?
              isCompact ? 'text-15 leading-6' : 'text-18 leading-7'
            : isCompact ? 'text-24'
            : 'text-28'
          }`}
        >
          {value}
        </strong>
        <p className={`mt-1 ${isCompact ? 'text-10' : 'text-11'} text-secondary-400`}>
          {note}
        </p>
      </div>
    </article>
  );
};

export default StatCard;
