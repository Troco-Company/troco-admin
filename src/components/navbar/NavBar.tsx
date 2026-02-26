'use client'

import { useEffect, useMemo, useState } from "react";
import { toast} from "sonner";
import Image from "next/image";
import TrackTransaction from "@/components/transactions/TrackTransaction";
import Notification from "@/utils/interfaces/Notification";
import BroadcaseMessage from "./BroadcaseMessage";
import FeeCalculator from "./FeeCalculator";
import NotificationsLayout from "./NotificationsLayout";
import { useAdmin } from "@/providers/AdminProvider";
import SetAdminPin from "./SetAdminPin";
import { HugeiconsIcon } from "@hugeicons/react";
import {CalculatorIcon, LockPasswordIcon, MailSend01Icon, Notification01Icon, SearchDollarIcon} from '@hugeicons/core-free-icons'



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
      <div className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white pl-3 pr-8 shadow-sm">

        <div className="flex flex-1 items-center justify-end justify-self-end gap-x-6">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-tertiary" >
            <div title="Fee Calculator">
              <HugeiconsIcon icon={CalculatorIcon} onClick={()=>setShowFeeCalculator(true)} className="cursor-pointer w-5 h-5 text-secondary" />
            </div>

            {showFeeCalculator && <FeeCalculator onCancel={()=> setShowFeeCalculator(false)} />}

          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <div title="Broadcast Message">
              <HugeiconsIcon icon={MailSend01Icon} onClick={()=>setShowBroadcastUI(true)} className="cursor-pointer text-[20px] text-secondary w-5 h-5"/>
            </div>

             {showBroadcastUI && <BroadcaseMessage onCancel={()=> setShowBroadcastUI(false)} />} 
          </div>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <div title="Track Transaction">
              <HugeiconsIcon icon={SearchDollarIcon} onClick={()=>setShowTrackUI(!showTrackUI)} className="cursor-pointer text-[20px] text-secondary w-5 h-5"/>
            </div>
            
            {showTrackUI && (
              <TrackTransaction onCancel={()=>setShowTrackUI(false)}/>
            )}
          </div>

          {adminOnline.role === 'Super Admin' && <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <div title="Change Portal Code">
              <HugeiconsIcon icon={LockPasswordIcon} onClick={()=>setShowChangeAuthPin(true)} className="cursor-pointer text-[20px] text-secondary w-5 h-5"/>
            </div>
          
             {showChangeAuthPin && <SetAdminPin onCancel={()=> setShowChangeAuthPin(false)} />} 
          </div>}

          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-tertiary">
            <div title="Notifications">
              <HugeiconsIcon icon={Notification01Icon} onClick={toggleNotifications} className="cursor-pointer text-[20px] text-secondary w-5 h-5"/>
            </div>
          
            {unreadNotificationCount > 0 && (
              <div className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-themeColor text-center text-[10px] font-semibold text-white">
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
