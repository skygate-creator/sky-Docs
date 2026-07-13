'use client';

import { LogOut, Camera } from 'lucide-react';
import { createClient } from '.././../../lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ChangeImage from '../ChangeImage/ChangeImage';

const NavDrop = ({ id }: { id: string }) => {
  const supabase = createClient();
  const router = useRouter();
  const [is_open, setIsOpen] = useState<boolean>(false);
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    router.refresh();
  };

  return (
    <>
      <div className="w-56 rounded-xl border border-neutral-200 bg-white shadow-lg overflow-hidden absolute top-16 left-0">
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-100 transition-colors"
        >
          <Camera size={18} />
          <span>تعديل الصورة</span>
        </button>

        <div className="h-px bg-neutral-200" />

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {is_open && <ChangeImage id={id} setIsOpen={setIsOpen} />}
    </>
  );
};

export default NavDrop;
