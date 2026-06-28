"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const initialState = {
  error: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full mt-6" isLoading={pending}>
      {!pending && (
        <>
          Se connecter <ArrowRight className="ml-2 w-4 h-4" />
        </>
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="flex flex-col">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block mb-4">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Sir<span className="text-primary-600">y</span>ia.
          </span>
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">Bon retour !</h1>
        <p className="text-sm text-slate-500 mt-2">Connectez-vous pour accéder à votre espace.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
            {state.error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs text-slate-600 font-medium ml-1">Email ou Téléphone</label>
          <Input 
            name="identifier" 
            type="text" 
            placeholder="vous@exemple.com ou +228..." 
            icon={<Mail className="w-4 h-4" />} 
            required 
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs text-slate-600 font-medium">Mot de passe</label>
            <Link href="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
              Oublié ?
            </Link>
          </div>
          <Input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            icon={<Lock className="w-4 h-4" />} 
            required 
          />
        </div>

        <SubmitButton />
      </form>

      <p className="text-center text-sm text-slate-500 mt-8">
        Vous n'avez pas de compte ?{" "}
        <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
