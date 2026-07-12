'use client';
import Image from 'next/image';
import { useState } from 'react';
import NavDrop from '../NavDrop/NavDrop';

const NavClient = ({
  id,
  name,
  job,
}: {
  id: string;
  name: string;
  job: string;
}) => {
  const [is_clicked, setIsClicked] = useState<boolean>(false);
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 py-2 px-3 border-b border-secondary-200 bg-white">
      <div className="flex justify-between items-center">
        <div className="name">
          <h1 className="text-20 text-secondary-700 font-bold">
            مرحبا بعودتك, {name}
          </h1>
          <span className="text-secondary-400 text-18 font-medium">{job}</span>
        </div>
        <div
          onClick={() => setIsClicked(!is_clicked)}
          className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-300 cursor-pointer"
        >
          <Image
            src="/login_img.webp"
            alt="Avatar"
            fill
            className="object-cover"
          />
        </div>
      </div>
      {is_clicked && <NavDrop />}
    </nav>
  );
};

export default NavClient;
