'use client'

import AdminsTable from '@/components/admins/AdminsTable';
import SearchBar from '@/components/search-bar/SearchBar';
import React, { useState } from 'react'
import { AdminRole } from '@/utils/interfaces/admin';

export default function AdminsPage() {
  const [search, setSearch] = useState('');
  const menus : (AdminRole | 'All')[] = ['All', 'Admin', 'Super Admin', 'Secretary', 'Customer Care'];
  const [filter, setFilter] = useState<AdminRole | 'All'>('All');
  
  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 py-2'>
      <div className='w-full h-fit gap-8 flex flex-col mb-8'>
        <div className='w-full flex justify-between items-center'>
          <h1 className="text-gray-700 text-[25px] font-bold">Admins</h1>
          <SearchBar
            placeholder='Search Admins'
            onChangeText={setSearch}
            value={search}
          />
        </div>
        <div className='w-full border-b border-[#E5E7EB]'>
          <div className='flex items-center gap-10 text-[14px] font-semibold'>
            {menus.map((menu) => (
              <button
                key={menu}
                onClick={() => setFilter(menu)}
                className={`pb-3 pt-1 transition-colors duration-200 relative ${
                  filter === menu
                    ? 'text-black'
                    : 'text-secondary hover:text-black'
                }`}
              >
                {menu}
                {filter === menu && (
                  <span className='absolute left-0 -bottom-[1px] h-[2px] w-full bg-themeColor rounded-full' />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdminsTable search={search} filter={filter} />
    </div>
  )
}
