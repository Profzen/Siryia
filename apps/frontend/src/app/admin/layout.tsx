'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Ticket, Wallet, LogOut, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isHydrated, logout } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        router.push('/login');
      } else if (!user.roles?.includes('ADMIN') && !user.roles?.includes('SUPER_ADMIN')) {
        router.push('/dashboard');
      } else {
        setAuthorized(true);
      }
    }
  }, [isHydrated, user, router]);

  if (!isHydrated || !authorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <ShieldAlert className="w-16 h-16 text-primary-500 mb-4" />
        <h1 className="text-2xl font-bold">Vérification des droits...</h1>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard KPI', icon: LayoutDashboard, href: '/admin' },
    { name: 'Utilisateurs & KYC', icon: Users, href: '/admin/users' },
    { name: 'Support & Litiges', icon: Ticket, href: '/admin/tickets' },
    { name: 'Finance & Escrow', icon: Wallet, href: '/admin/finance' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-300">
      {/* Sidebar Admin (Dark Theme) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Sir<span className="text-primary-500">y</span>ia. <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary-600 text-white font-medium shadow-lg shadow-primary-900/50' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.profile?.firstName?.[0] || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.profile?.firstName || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-auto">
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
