// components/AllEmployee/AllEmployee.tsx
'use client';
import { Profile, RecentClient } from '@/interface';
import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import EmployeeCard from '../EmployeeCard/EmployeeCard';

const AllEmployee = ({ users }: { users: Profile[] }) => {
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    return users.filter(
      (user) =>
        user?.name?.toLowerCase().includes(search.trim().toLowerCase()) ||
        user?.job_title?.toLowerCase().includes(search.trim().toLowerCase()),
    );
  }, [users, search]);

  return (
    <div className="flex flex-col gap-5">
      {/* Search bar */}
      <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-300 bg-white px-4 py-3">
        <button
          type="button"
          className="rounded-lg bg-neutral-100 px-4 py-2 text-13 font-bold text-secondary-700"
        >
          تصفية
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن موظف بالاسم أو التخصص..."
            className="w-full text-right outline-none text-14 text-secondary-700 placeholder:text-neutral-400"
          />
        </div>
        <Search className="h-5 w-5 text-primary-600" />
      </div>

      {filteredUsers.length === 0 ?
        <p className="text-center text-sm text-neutral-500 py-10">
          لا يوجد موظفين مطابقين للبحث
        </p>
      : <div className="grid grid-cols-3 gap-5">
          {filteredUsers.map((user) => (
            <EmployeeCard key={user.id} user={user} />
          ))}
        </div>
      }
    </div>
  );
};

export default AllEmployee;
