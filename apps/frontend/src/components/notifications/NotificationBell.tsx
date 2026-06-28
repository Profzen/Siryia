'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useSocketStore } from '@/store/useSocketStore';
import clsx from 'clsx';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useSocketStore();
  
  // Dans un cas réel, vous vérifieriez msg.read == false. Ici on compte tout pour la démo.
  const unreadCount = notifications.length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
          <NotificationDropdown onClose={() => setIsOpen(false)} notifications={notifications} />
        </div>
      )}
    </div>
  );
}
