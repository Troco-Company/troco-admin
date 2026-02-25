'use client'

import React, { useEffect, useMemo, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import { FaCalculator } from "react-icons/fa";
import { IoSearchCircleSharp } from "react-icons/io5";
import { PiPaperPlaneTiltFill} from "react-icons/pi";
import { toast} from "sonner";
import Image from "next/image";
import TrackTransaction from "@/components/transactions/TrackTransaction";
import Notification from "@/utils/interfaces/Notification";
import BroadcaseMessage from "./BroadcaseMessage";
import FeeCalculator from "./FeeCalculator";
import NotificationsLayout from "./NotificationsLayout";
import { useAdmin } from "@/providers/AdminProvider";
import SetAdminPin from "./SetAdminPin";
import { Lock } from "iconsax-react";
import { Colors } from "@/utils/Colors";



const Navbar = () => {
  const {admin, notifications} = useAdmin();
  const adminOnline = admin!;

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showTrackUI, setShowTrackUI] = useState(false);
  const [showChangeAuthPin, setShowChangeAuthPin] = useState(false);

  const [showFeeCalculator, setShowFeeCalculator] = useState(false);
  const [showBroadcastUI, setShowBroadcastUI] = useState(false);

  const unreadNotificationCount = useMemo(()=>notifications.filter(notification => !notification.read).length || 0, [notifications]);


  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const closeNotificationModal = () => {
    setSelectedNotification(null);
  };

  useEffect(() => {
    if (unreadNotificationCount > 0) {
      toast.info(`You have ${unreadNotificationCount} unread notifications`, {
        id:'notification-toast'
      });
    }
  }, [unreadNotificationCount]);

  return (
    <>
      <div className="mb-3 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white pl-3 pr-8 shadow-sm">

        <div className="flex flex-1 items-center justify-end justify-self-end gap-x-6">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <FaCalculator onClick={()=>setShowFeeCalculator(true)} title="Fee Calculator" className="cursor-pointer text-[16px] text-themeColor" />

            {showFeeCalculator && <FeeCalculator onCancel={()=> setShowFeeCalculator(false)} />}

          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <PiPaperPlaneTiltFill onClick={()=>setShowBroadcastUI(true)} className="cursor-pointer text-[20px] text-themeColor" title="Broadcast Message"/>

             {showBroadcastUI && <BroadcaseMessage onCancel={()=> setShowBroadcastUI(false)} />} 
          </div>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <IoSearchCircleSharp onClick={()=>setShowTrackUI(!showTrackUI)} className="cursor-pointer text-[20px] text-themeColor" title="Track Transaction" />

            {showTrackUI && (
              <TrackTransaction onCancel={()=>setShowTrackUI(false)}/>
            )}
          </div>

          {adminOnline.role === 'Super Admin' && <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <Lock onClick={()=>setShowChangeAuthPin(true)} className="cursor-pointer text-[20px] text-themeColor" size={20} variant="Bold" color={Colors.secondary}/>

             {showChangeAuthPin && <SetAdminPin onCancel={()=> setShowChangeAuthPin(false)} />} 
          </div>}

          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <IoNotifications onClick={toggleNotifications} title="Notifications" className="cursor-pointer text-[20px] text-secondary" />
            {unreadNotificationCount > 0 && (
              <div className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-white bg-themeColor text-center text-[10px] font-semibold text-white">
                <p>{unreadNotificationCount}</p>
              </div>
            )}
            {showNotifications && <NotificationsLayout notifications={notifications} />}
          </div>

          <div className="flex items-center gap-x-3">
            <div className="flex flex-col">
              <p className="text-[14px] font-semibold leading-tight">
                {adminOnline && adminOnline.username && adminOnline.username.charAt(0).toUpperCase() + adminOnline.username.slice(1)}
              </p>
              <p className="text-[10px] font-medium text-gray-500">{adminOnline?.role}</p>
            </div>
            <Image src='/images/profile_img.png' width={52} height={52} objectFit='cover' alt="profile-icon" className="h-[52px] w-[52px]" />
          </div>
        </div>

        {selectedNotification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-md shadow-lg w-96 p-4 flex flex-col">
              <h2 className="text-lg font-bold">{selectedNotification.notificationTitle}</h2>
              <p className="mt-2">{selectedNotification.notificationContent}</p>
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md" onClick={closeNotificationModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
