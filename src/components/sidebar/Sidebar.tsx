"use client";

import Routes from '@/app/routes';
import { useSideBarMenu } from '@/utils/data/SideBarData';
import { HambergerMenu } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function SideBar() {
    const [expand, expandDrawer] = useState<boolean>(true);
    const router = useRouter();
    const pathName = usePathname();

    const menus = useSideBarMenu();

    const menusWithIndex = menus.map((item, index) => ({ item, index }));
    const bottomMenus = menusWithIndex.filter(
      ({ item }) => item.negative || item.path === Routes.dashboard.profile.path,
    );
    const mainMenus = menusWithIndex.filter(
      ({ item }) => !item.negative && item.path !== Routes.dashboard.profile.path,
    );

    const isActiveRoute = (itemPath: string, index: number, negative?: boolean) => {
      if (negative || !itemPath) return false;
      return index === 0 ? pathName === itemPath : pathName.startsWith(itemPath);
    };

    const renderMenuItem = (item: (typeof menus)[number], index: number) => {
      const isActive = isActiveRoute(item.path, index, item.negative);

      return (
        <Link
          key={`${item.title}-${index}`}
          href={item.path}
          onClick={
            !item.negative
              ? undefined
              : (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (item.onClick) {
                    item.onClick();
                  }
                }
          }
          className={`group flex h-11 w-full items-center rounded-lg px-3 text-[14px] font-medium transition-all duration-200 ${
            expand ? 'justify-start gap-3' : 'justify-center'
          } ${
            isActive
              ? 'bg-themeColor/15 text-themeColor'
              : item.negative
              ? 'text-red-500 hover:bg-red-50'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-500'
          }`}
        >
          <span className='shrink-0 text-current'>{item.icon}</span>

          <span
            className={`whitespace-nowrap text-[14px] ${
              expand ? 'max-w-full opacity-100' : 'max-w-0 overflow-hidden opacity-0'
            } ${item.negative ? 'text-red-500' : ''} transition-all duration-200`}
          >
            {item.title}
          </span>
        </Link>
      );
    };

  return (
    <aside
      className={`flex h-screen flex-col overflow-hidden border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
        expand ? 'w-[248px]' : 'w-[84px]'
      }`}
    >
      <div
        className={`flex h-16 items-center border-b border-slate-200 px-4 ${
          expand ? 'gap-3' : 'justify-center'
        }`}
      >
        <button
          onClick={() => expandDrawer(!expand)}
          className='flex h-9 w-9 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100'
          aria-label='Toggle sidebar'
        >
          <HambergerMenu
            color={'currentColor'}
            className={`h-6 w-6 ${expand ? 'rotate-0' : 'rotate-180'} transition-transform duration-300 ease-in-out`}
          />
        </button>

        {expand && (
          <Image
            onClick={() => router.replace(Routes.dashboard.path)}
            src={'/images/dashboard/troco.png'}
            className='h-auto w-[104px] cursor-pointer object-contain'
            alt='troco'
            width={104}
            height={26}
          />
        )}
      </div>

      <div className='flex min-h-0 flex-1 flex-col'>
        <div className='custom-scrollbar flex-1 overflow-y-auto py-4'>
          <nav className='flex w-full flex-col gap-1 px-3'>
            {mainMenus.map(({ item, index }) => renderMenuItem(item, index))}
          </nav>
        </div>

        {bottomMenus.length > 0 && (
          <div className='border-t border-slate-200 px-3 py-3'>
            <nav className='flex w-full flex-col gap-1'>
              {bottomMenus.map(({ item, index }) => renderMenuItem(item, index))}
            </nav>
          </div>
        )}
      </div>
    </aside>
  )
}
