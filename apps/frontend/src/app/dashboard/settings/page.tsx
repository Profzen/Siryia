import { Card } from "@/components/ui/Card";
import { Settings, Shield, Bell, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Paramètres</h1>
        <p className="text-slate-600 mt-1">Gérez vos préférences et la sécurité de votre compte.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-100 rounded-full text-slate-600">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">Sécurité</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Mettez à jour votre mot de passe et configurez l'A2F.</p>
          <button className="text-primary-600 font-medium hover:underline">Modifier le mot de passe</button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-slate-100 rounded-full text-slate-600">
              <Bell className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">Gérez vos préférences de notifications email et push.</p>
          <button className="text-primary-600 font-medium hover:underline">Gérer les notifications</button>
        </Card>
      </div>
    </div>
  );
}
