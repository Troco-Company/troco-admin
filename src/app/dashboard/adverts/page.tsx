'use client';

import Routes from '@/app/routes';
import LoadingLayout from '@/components/loading/LoadingLayout';
import SearchBar from '@/components/search-bar/SearchBar';
import { convertApiMethod } from '@/providers/UserProvider';
import { Advertisement, getActiveAdvertisements, getPendingAdvertisements } from '@/services/rest-api/advert-api';
import formatDate from '@/utils/DateFormat';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import loadingAnim from '../../../../public/lottie/loading_water.json';
import emptyAnim from '../../../../public/lottie/empty.json';

export default function AdvertsPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const router = useRouter();

  const activeQuery = useQuery({
    queryKey: ['adverts', 'active'],
    queryFn: () => convertApiMethod(getActiveAdvertisements(true)),
    notifyOnChangeProps: ['data', 'dataUpdatedAt'],
    refetchInterval: 3.1 * 1000,
  });

  const pendingQuery = useQuery({
    queryKey: ['adverts', 'pending'],
    queryFn: () => convertApiMethod(getPendingAdvertisements(true)),
    notifyOnChangeProps: ['data', 'dataUpdatedAt'],
    refetchInterval: 3.1 * 1000,
  });

  const activeAdverts = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);
  const pendingAdverts = useMemo(() => pendingQuery.data ?? [], [pendingQuery.data]);

  const filterAdverts = (adverts: Advertisement[]) => {
    const q = search.trim().toLowerCase();
    if (!q) return adverts;

    return adverts.filter((advert) =>
      [
        advert.description,
        advert.redirectUrl,
        advert.status,
        `${advert.user.firstName} ${advert.user.lastName}`,
      ]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  };

  const filteredActive = useMemo(() => filterAdverts(activeAdverts), [activeAdverts, search]);
  const filteredPending = useMemo(() => filterAdverts(pendingAdverts), [pendingAdverts, search]);
  const filteredCurrent = activeTab === 'pending' ? filteredPending : filteredActive;

  if ((activeQuery.isPending || pendingQuery.isPending) && !activeQuery.data && !pendingQuery.data) {
    return <LoadingLayout className='h-full' lottie={loadingAnim} label='Loading adverts...' />;
  }

  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 pb-6'>
      <div className='w-full h-fit flex flex-col gap-8 mt-2'>
        <div className='w-full flex justify-between'>
          <p className='text-secondary text-[26px] font-bold'>Adverts</p>
          <SearchBar
            placeholder={
              activeTab === 'pending'
                ? 'Search pending adverts by description or advertiser'
                : 'Search active adverts by description or advertiser'
            }
            value={search}
            onChangeText={setSearch}
          />
        </div>

        <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
          <div className='rounded-xl bg-white p-5 border border-[#E5E7EB]'>
            <p className='text-secondary text-sm'>Total Adverts</p>
            <h2 className='text-3xl font-bold'>{activeAdverts.length + pendingAdverts.length}</h2>
          </div>
          <div className='rounded-xl bg-white p-5 border border-[#E5E7EB]'>
            <p className='text-secondary text-sm'>Total Pending Adverts</p>
            <h2 className='text-3xl font-bold'>{pendingAdverts.length}</h2>
          </div>
          <div className='rounded-xl bg-white p-5 border border-[#E5E7EB]'>
            <p className='text-secondary text-sm'>Total Active Adverts</p>
            <h2 className='text-3xl font-bold'>{activeAdverts.length}</h2>
          </div>
          <div className='rounded-xl bg-white p-5 border border-[#E5E7EB]'>
            <p className='text-secondary text-sm'>Showing</p>
            <h2 className='text-3xl font-bold'>
              {activeTab === 'pending' ? filteredPending.length : filteredActive.length}
            </h2>
          </div>
        </div>

        <div className='w-full border-b border-[#E5E7EB]'>
          <div className='flex items-center gap-10 text-[14px] font-semibold'>
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-3 pt-1 transition-colors duration-200 relative ${
                  activeTab === 'pending'
                    ? 'text-black'
                    : 'text-secondary hover:text-black'
                }`}
              >
                Pending adverts
                {activeTab === 'pending' && (
                  <span className='absolute left-0 -bottom-[1px] h-[2px] w-full bg-themeColor rounded-full' />
                )}
              </button>
            <button
                onClick={() => setActiveTab('active')}
                className={`pb-3 pt-1 transition-colors duration-200 relative ${
                  activeTab === 'active'
                    ? 'text-black'
                    : 'text-secondary hover:text-black'
                }`}
              >
                Active adverts
                {activeTab === 'active' && (
                  <span className='absolute left-0 -bottom-[1px] h-[2px] w-full bg-themeColor rounded-full' />
                )}
              </button>
          </div>
        </div>

        <section className='rounded-xl w-full h-fit min-h-[250px] px-5 pb-6 bg-white mb-8 border border-[#E5E7EB]'>
          <div className='flex items-center justify-between py-4 my-2'>
            <h1 className='text-[24px] font-bold'>
              {activeTab === 'pending' ? 'Pending Adverts' : 'Active Adverts'}
            </h1>
            <p className='text-sm text-secondary'>{filteredCurrent.length} result(s)</p>
          </div>

          {activeTab === 'pending' ? (
            <>
              <p className='text-sm text-secondary mb-3'>Click a row to view full details</p>
              <div className='w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden'>
                <table className='w-full rounded-lg border table-fixed border-spacing-0 text-[14px] overflow-hidden'>
                  <thead className='px-5 py-3 h-[60px] border-b'>
                    <tr className='bg-tertiary'>
                      <th className='pl-5 py-3 text-start font-bold'>Advertiser</th>
                      <th className='py-3 text-start font-bold'>Description</th>
                      <th className='py-3 text-center font-bold'>Status</th>
                      <th className='py-3 text-center font-bold pr-3'>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPending.length === 0 && (
                      <tr>
                        <td colSpan={4} className='text-center py-4'>
                          {search.trim() ? `No pending adverts found for '${search.trim()}'` : 'No pending adverts'}
                        </td>
                      </tr>
                    )}

                    {filteredPending.map((advert) => (
                      <tr
                        key={advert._id}
                        onClick={() => router.push(`${Routes.dashboard.adverts.path}/${advert._id}`)}
                        className='cursor-pointer hover:bg-[#F9F8F6] font-quicksand font-[400] border-b last:border-b-0 transition-[background-color] ease-in duration-[0.4s]'
                      >
                        <td className='py-3 pl-3 overflow-hidden'>
                          <div className='flex items-center gap-2'>
                            <div className='w-[36px] h-[36px] rounded-full overflow-hidden bg-tertiary relative'>
                              <Image src={advert.user.userImage} alt='advertiser' fill className='object-cover' />
                            </div>
                            <p>{advert.user.firstName} {advert.user.lastName}</p>
                          </div>
                        </td>
                        <td className='py-3 text-start max-w-[300px] truncate'>{advert.description}</td>
                        <td className='py-3 text-center'>
                          <span className='px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-xs'>
                            {advert.status}
                          </span>
                        </td>
                        <td className='py-3 text-center pr-3'>{formatDate(advert.createdAt, false)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : filteredActive.length === 0 ? (
            <LoadingLayout
              className='h-[220px] shadow-none'
              lottie={emptyAnim}
              label={search.trim() ? `No active adverts found for '${search.trim()}'` : 'No active adverts yet'}
              style={{ boxShadow: 'none' }}
            />
          ) : (
            <>
              <p className='text-sm text-secondary mb-3'>Showing active adverts (read-only)</p>
              <div className='grid grid-cols-1 gap-5'>
                {filteredActive.map((advert) => (
                  <div key={advert._id} className='border rounded-xl p-4 hover:bg-[#F9F8F6] transition-colors duration-300'>
                    <div className='relative w-full aspect-[4/1] rounded-lg overflow-hidden bg-tertiary'>
                      <Image src={advert.image} alt='advert banner' fill className='object-cover' />
                    </div>
                    <div className='mt-3 flex flex-col gap-1'>
                      <p className='font-semibold text-[16px]'>
                        {advert.user.firstName} {advert.user.lastName}
                      </p>
                      <p className='text-sm text-secondary line-clamp-2'>{advert.description}</p>
                      <a href={advert.redirectUrl} target='_blank' rel='noreferrer' className='text-sm text-themeColor underline break-all'>
                        {advert.redirectUrl}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
