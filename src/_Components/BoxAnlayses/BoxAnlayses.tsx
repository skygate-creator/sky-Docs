import { LucideIcon } from 'lucide-react';

interface BoxAnlaysesProps {
  text: string;
  price: number;
  icon: LucideIcon;
  currency?: string;
}
const BoxAnlayses = ({
  text,
  price,
  icon: Icon,
  currency,
}: BoxAnlaysesProps) => {
  return (
    <div className="p-5 flex justify-between items-center bg-neutral-100 border-2 border-secondary-200 rounded-lg">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-20 text-neutral-700">{text}</h3>
        <p className="font-bold text-28">
          {currency} {price}
        </p>
      </div>
      <div className="text-secondary-600 w-11 h-11 flex justify-center items-center bg-primary-200 rounded-lg ">
        <Icon className="w-8 h-8" />
      </div>
    </div>
  );
};

export default BoxAnlayses;
