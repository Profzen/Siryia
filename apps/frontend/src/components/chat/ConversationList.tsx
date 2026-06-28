'use client';

import clsx from 'clsx';
import { User } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage?: string;
}

interface ConversationListProps {
  contacts: Contact[];
  selectedUserId: string | null;
  onSelect: (userId: string) => void;
}

export function ConversationList({ contacts, selectedUserId, onSelect }: ConversationListProps) {
  return (
    <ul className="divide-y divide-slate-100">
      {contacts.map((contact) => (
        <li key={contact.id}>
          <button
            onClick={() => onSelect(contact.id)}
            className={clsx(
              "w-full text-left flex items-center gap-3 p-4 hover:bg-slate-100 transition-colors cursor-pointer",
              selectedUserId === contact.id && "bg-primary-50 border-l-4 border-primary-500"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
              {contact.avatar ? (
                <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-800 truncate">{contact.name}</h3>
              <p className="text-xs text-slate-500 truncate">{contact.lastMessage || 'Nouvelle conversation'}</p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
