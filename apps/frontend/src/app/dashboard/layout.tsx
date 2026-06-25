import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import Link from "next/link";
import { LogOut, Home, User, Settings, ShieldCheck } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("siryia_token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white z-10 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/">
            <span className="text-xl font-bold tracking-tight">
              Sir<span className="text-primary-500">y</span>ia.
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors">
            <Home className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium">Vue d'ensemble</span>
          </Link>
          <Link href="/dashboard/kyc" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Vérification KYC</span>
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Mon Profil</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Paramètres</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center justify-center w-full gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-red-50 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col z-10 relative overflow-y-auto bg-slate-50">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 md:hidden">
          <span className="text-xl font-bold tracking-tight text-primary-600">Sir<span className="text-primary-500">y</span>ia.</span>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
