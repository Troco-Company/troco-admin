'use client';


import DashboardCard from '@/components/cards/DashboardCard';
import SearchBar from '@/components/search-bar/SearchBar';
import UsersTable from '@/components/users/UsersTable';
import { useDashboardStats } from '@/providers/DashboardProvider';
import { formatDigits } from '@/utils/Format';
import React, { useState } from 'react'

export default function UsersPage() {
  const {users:{businessAccounts, companyAccounts, personalAccounts, merchantAccounts}} = useDashboardStats()
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'Online' | 'Offline' | 'all' | 'personal' | 'merchant' | 'business' | 'company'>('all');
  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 pb-2'>
      <div className='w-full h-fit flex flex-col gap-8 mt-2'>
        <div className='w-full flex justify-between'>
          <p className='text-secondary text-[26px] font-bold'>Users</p>
          <SearchBar placeholder='Search By Name or Category' value={search} onChangeText={setSearch}/>
        </div>
       
          {/* Analysis Cards */}
          <div className="w-full h-fit flex flex-wrap gap-4">
            <DashboardCard 
              label='Personal Accounts'
              value={formatDigits(personalAccounts)}
              background='brown'
              icon={'/icons/dashboard/users.svg'}
            />
            <DashboardCard 
              label='Merchant Accounts'
              value={formatDigits(merchantAccounts)}
              background='#2196F3'
              top={false}
              bottom={true}
              icon={'/icons/dashboard/merchant-icon.svg'}
            />
            <DashboardCard 
              label='Business Accounts'
              value={formatDigits(businessAccounts)}
              background='#9C27B0'
              icon={'/icons/dashboard/business-icon.svg'}
            />
            <DashboardCard 
              label='Company Accounts'
              value={formatDigits(companyAccounts)}
              top={false}
              background='#FF6E40FF'
              bottom={true}
              icon={'/icons/dashboard/company-icon.svg'}
            />
          </div>

        <div className='w-full border-b border-[#E5E7EB]'>
          <div className='flex items-center gap-10 text-[14px] font-semibold flex-wrap'>
            {['All', 'Online', 'Offline', 'Personal', 'Merchant', 'Business', 'Company'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  switch (tab) {
                    case 'All':
                      setFilter('all');
                      break;
                    case 'Online':
                      setFilter('Online');
                      break;
                    case 'Offline':
                      setFilter('Offline');
                      break;
                    case 'Personal':
                      setFilter('personal');
                      break;
                    case 'Merchant':
                      setFilter('merchant');
                      break;
                    case 'Business':
                      setFilter('business');
                      break;
                    case 'Company':
                      setFilter('company');
                      break;
                  }
                }}
                className={`pb-3 pt-1 transition-colors duration-200 relative ${
                  (tab === 'All' && filter === 'all')
                    || (tab === 'Online' && filter === 'Online')
                    || (tab === 'Offline' && filter === 'Offline')
                    || (tab === 'Personal' && filter === 'personal')
                    || (tab === 'Merchant' && filter === 'merchant')
                    || (tab === 'Business' && filter === 'business')
                    || (tab === 'Company' && filter === 'company')
                    ? 'text-black'
                    : 'text-secondary hover:text-black'
                }`}
              >
                {tab}
                {((tab === 'All' && filter === 'all')
                  || (tab === 'Online' && filter === 'Online')
                  || (tab === 'Offline' && filter === 'Offline')
                  || (tab === 'Personal' && filter === 'personal')
                  || (tab === 'Merchant' && filter === 'merchant')
                  || (tab === 'Business' && filter === 'business')
                  || (tab === 'Company' && filter === 'company')) && (
                  <span className='absolute left-0 -bottom-[1px] h-[2px] w-full bg-themeColor rounded-full' />
                )}
              </button>
            ))}
          </div>
        </div>

          <UsersTable search={search} filter={filter} />

      </div>
    </div>
  )
}
