import AllClintes from '@/_Components/AllClients/AllClients';
import BoxAnlayses from '@/_Components/BoxAnlayses/BoxAnlayses';
import { Users } from 'lucide-react';
import getAllClients from '../../../../lib/Helper/getAllClients';
import { RecentClient } from '@/interface';
import getTotalTripPrice from '../../../../lib/Helper/getTotalTripPrice';

const customer = async () => {
  const clients: RecentClient[] = await getAllClients();
  const totalPrice = await getTotalTripPrice();

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="title flex flex-col gap-2">
        <h2 className="text-24 font-bold text-primary-500">العملاء</h2>
        <p className="text-secondary-400 font-medium text-16">
          استعرض جميع العملاء وابحث عن أي عميل بسهولة.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <BoxAnlayses text="العملاء" price={clients.length} icon={Users} />
        <BoxAnlayses
          text="إجمالي المبيعات"
          price={totalPrice}
          icon={Users}
          currency={clients[0]?.currency}
        />
      </div>
      <AllClintes clients={clients} />
    </div>
  );
};

export default customer;
