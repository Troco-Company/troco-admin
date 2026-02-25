'use client'
import routes from '@/app/routes';
import { useAdmin } from '@/providers/AdminProvider';
import { JSX } from 'react';
import { HugeiconsIcon } from '@hugeicons/react'
import { AlertCircleIcon, CustomerSupportIcon, GiftIcon, LogoutSquare01Icon, Megaphone02Icon, MentoringIcon, NewReleasesIcon, PercentCircleIcon, ShoppingBasket03Icon, TransactionIcon, UserCircleIcon, UserGroup02Icon, Wallet03Icon } from '@hugeicons/core-free-icons'
import { Element2 } from 'iconsax-react';

export type SideBarData = {
    icon: JSX.Element,
    path: string,
    title: string,
    onClick?: ()=>Promise<void>,
    negative?: boolean
}

export const SideBarArray : SideBarData[] = [
  {
    icon: <Element2 color='currentColor' className="h-5 w-5"/> ,
    path: routes.dashboard.path,
    title: "Dashboard",
  },
  {
    icon: <HugeiconsIcon icon={UserGroup02Icon} className='h-5 w-5' />,
    path: routes.dashboard.users.path,
    title: "Users",
  },
  
  {
    icon: <HugeiconsIcon icon={TransactionIcon} className='h-5 w-5' />,
    path: routes.dashboard.transactions.path,
    title: "Transactions",
  },
  {
    icon: <HugeiconsIcon icon={Megaphone02Icon} className='h-5 w-5' />,
    path: routes.dashboard.users.path,
    title: "Adverts",
  },
  
]; 

export const useSideBarMenu = (): SideBarData[] =>{
  const basicData = Array.from(SideBarArray);
  const {admin, logout} = useAdmin();

  if(!admin) return basicData;

  if(admin.role !== 'Admin'){
    
      basicData.push({
      icon: <HugeiconsIcon icon={NewReleasesIcon} className='h-5 w-5' />,
      path: routes.dashboard.kyc.path,
      title: "KYC Verifications",
    },
    {
      icon: <HugeiconsIcon icon={AlertCircleIcon} className='h-5 w-5' />,
      path: routes.dashboard.reports.path,
      title: "Reports",
    },
    )
  }

  if(admin.role === 'Secretary' || admin.role === 'Super Admin'){
    basicData.push({
      icon: <HugeiconsIcon icon={PercentCircleIcon} className='h-5 w-5' />,
      title: 'Charges',
      path: routes.dashboard.charges.path
    })
  }

  if(admin.role === 'Admin' || admin.role === 'Super Admin'){
    basicData.push({
      icon: <HugeiconsIcon icon={ShoppingBasket03Icon} className='h-5 w-5' />,
      title: 'Orders',
      path: routes.dashboard.orders.path
    });
  }

  if(admin.role === 'Customer Care'){
    basicData.push({
      icon: <HugeiconsIcon icon={CustomerSupportIcon} className='h-5 w-5' />,
      title:'Customer Sessions',
      path: routes.dashboard.sessions.path
    });
  }

  if(admin.role === 'Super Admin'){
    basicData.push({
      icon: <HugeiconsIcon icon={MentoringIcon} className='h-5 w-5' />,
      title:'Admins',
      path: routes.dashboard.allAdmin.path
    });
  }

  if(admin.role === 'Super Admin' || admin.role === 'Secretary'){
    basicData.push({
      icon: <HugeiconsIcon icon={Wallet03Icon} className='h-5 w-5' />,
      title:'Withdrawals',
      path: routes.dashboard.withdrawal.path
    },{
      icon: <HugeiconsIcon icon={GiftIcon} className='h-5 w-5' />,
      title:'Bonuses',
      path: routes.dashboard.bonuses.path
    })
  }

  basicData.push({
      icon: <HugeiconsIcon icon={UserCircleIcon} className='h-5 w-5' />,
      title:'Profile',
      path: routes.dashboard.profile.path
    }, {
      title: "Logout",
      icon: <HugeiconsIcon icon={LogoutSquare01Icon} className='h-5 w-5' />,
      path:"",
      negative: true,
      onClick: logout});

  




  return basicData;
}




