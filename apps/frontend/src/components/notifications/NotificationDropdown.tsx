'use client';

import { X, Check } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
  notifications: any[];
}

export function NotificationDropdown({ onClose, notifications }: NotificationDropdownProps) {
  return (
    <div className="flex flex-col max-h-96">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800">Notifications</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Aucune nouvelle notification
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {notifications.map((notif, idx) => (
              <li key={notif.id || idx} className="p-4 hover:bg-slate-50 transition-colors">
                <p className="text-sm text-slate-800">{notif.content || notif.message}</p>
                <p className="text-xs text-slate-400 mt-1">À l'instant</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 border-t border-slate-100 bg-slate-50">
          <button 
            className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            onClick={onClose}
          >
            <Check className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        </div>
      )}
    </div>
  );
}
