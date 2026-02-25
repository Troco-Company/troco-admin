'use client';

import Routes from '@/app/routes';
import Button from '@/components/Button';
import LoadingLayout from '@/components/loading/LoadingLayout';
import { useAdmin } from '@/providers/AdminProvider';
import { convertApiMethod } from '@/providers/UserProvider';
import { approveAdvertisement, deleteAdvertisement, getPendingAdvertisements } from '@/services/rest-api/advert-api';
import formatDate from '@/utils/DateFormat';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { toast } from 'sonner';
import loadingAnim from '../../../../../public/lottie/loading_water.json';
import errorAnim from '../../../../../public/lottie/error.json';

export default function AdvertDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { admin } = useAdmin();

  const advertId = id?.toString() ?? '';

  const advertsQuery = useQuery({
    queryKey: ['adverts', 'pending'],
    queryFn: () => convertApiMethod(getPendingAdvertisements(true)),
    notifyOnChangeProps: ['data', 'dataUpdatedAt'],
    refetchInterval: 3.1 * 1000,
  });

  const advert = useMemo(
    () => (advertsQuery.data ?? []).find((item) => item._id === advertId),
    [advertsQuery.data, advertId],
  );

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!admin?._id || !advert) throw new Error('Missing admin or advert');
      return approveAdvertisement({ advertId: advert._id, adminId: admin._id }, true);
    },
    onSuccess: () => {
      toast.success('Advertisement approved successfully');
      router.replace(Routes.dashboard.adverts.path);
    },
    onError: () => toast.error('Unable to approve advert'),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!admin?._id || !advert) throw new Error('Missing admin or advert');
      return deleteAdvertisement({ advertId: advert._id, adminId: admin._id }, true);
    },
    onSuccess: () => {
      toast.success('Advertisement deleted successfully');
      router.replace(Routes.dashboard.adverts.path);
    },
    onError: () => toast.error('Unable to delete advert'),
  });

  if (advertsQuery.isPending) {
    return <LoadingLayout className='h-full' lottie={loadingAnim} label='Loading advert details...' />;
  }

  if (!advert) {
    return <LoadingLayout className='h-full' lottie={errorAnim} label='Pending advert not found' />;
  }

  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 pb-6'>
      <div className='w-full h-fit flex flex-col gap-6 mt-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-secondary text-[26px] font-bold'>Advert Details</h1>
          <button
            onClick={() => router.replace(Routes.dashboard.adverts.path)}
            className='rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-white transition-colors duration-200'
          >
            Back to Adverts
          </button>
        </div>

        <div className='w-full rounded-lg bg-white shadow-lg p-5 flex flex-col gap-5'>
          <div className='relative w-full aspect-[4/1] rounded-lg overflow-hidden bg-tertiary'>
            <Image src={advert.image} alt='advert banner' fill className='object-cover' />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='rounded-lg border p-4'>
              <p className='text-xs text-secondary font-semibold'>ADVERT ID</p>
              <p className='font-medium break-all'>{advert._id}</p>
            </div>

            <div className='rounded-lg border p-4'>
              <p className='text-xs text-secondary font-semibold'>STATUS</p>
              <p className='font-medium capitalize text-orange-700'>{advert.status}</p>
            </div>

            <div className='rounded-lg border p-4'>
              <p className='text-xs text-secondary font-semibold'>ADVERTISER</p>
              <p className='font-medium'>{advert.user.firstName} {advert.user.lastName}</p>
            </div>

            <div className='rounded-lg border p-4'>
              <p className='text-xs text-secondary font-semibold'>CREATED AT</p>
              <p className='font-medium'>{formatDate(advert.createdAt, false)}</p>
            </div>
          </div>

          <div className='rounded-lg border p-4'>
            <p className='text-xs text-secondary font-semibold'>DESCRIPTION</p>
            <p className='text-[15px] mt-1'>{advert.description}</p>
          </div>

          <div className='rounded-lg border p-4'>
            <p className='text-xs text-secondary font-semibold'>REDIRECT URL</p>
            <a href={advert.redirectUrl} target='_blank' rel='noreferrer' className='text-themeColor underline break-all'>
              {advert.redirectUrl}
            </a>
          </div>

          <div className='w-full flex flex-col sm:flex-row items-center gap-3'>
            <Button
              title='Approve Advert'
              loading={approveMutation.isPending}
              disabled={deleteMutation.isPending || !admin?._id}
              onClick={() => approveMutation.mutate()}
            />
            <Button
              title='Delete Advert'
              negative={true}
              loading={deleteMutation.isPending}
              disabled={approveMutation.isPending || !admin?._id}
              onClick={() => deleteMutation.mutate()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
