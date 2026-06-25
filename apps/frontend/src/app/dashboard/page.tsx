import { cookies } from "next/headers";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Calendar, Activity } from "lucide-react";

async function getUserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("siryia_token")?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 }, // Pas de cache pour les données privées
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUserProfile();

  if (!user) {
    return (
      <div className="text-white/50">
        Erreur de chargement du profil. Veuillez vous reconnecter.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-white/50 mt-1">Bienvenue sur votre espace sécurisé, {user.email}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-primary-500/20 rounded-full text-primary-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-white/50">Statut du compte</p>
            <p className="text-lg font-semibold">Actif</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-violet-500/20 rounded-full text-violet-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-white/50">Membre depuis</p>
            <p className="text-lg font-semibold">Aujourd'hui</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-full text-amber-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-white/50">Niveau KYC</p>
            <p className="text-lg font-semibold">Niveau 1</p>
          </div>
        </Card>
      </div>

      <Card className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 py-3 border-b border-white/5">
            <div className="text-white/50 text-sm">Identifiant (ID)</div>
            <div className="col-span-2 text-sm font-mono text-white/80">{user.userId || user.sub}</div>
          </div>
          <div className="grid grid-cols-3 py-3 border-b border-white/5">
            <div className="text-white/50 text-sm">Adresse Email</div>
            <div className="col-span-2 text-sm">{user.email}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
