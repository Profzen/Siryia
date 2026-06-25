"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerAction } from "@/app/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
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
          Créer mon compte <ArrowRight className="ml-2 w-4 h-4" />
        </>
      )}
    </Button>
  );
}

export default function SignupPage() {
  const [state, formAction] = useFormState(registerAction, initialState);

  return (
    <div className="flex flex-col">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block mb-4">
          <span className="text-2xl font-bold tracking-tight text-white">
            Sir<span className="text-primary-500">y</span>ia.
          </span>
        </Link>
        <h1 className="text-2xl font-semibold text-white">Rejoignez-nous</h1>
        <p className="text-sm text-white/50 mt-2">Créez votre compte en quelques secondes.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl">
            {state.error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs text-white/70 ml-1">Nom complet</label>
          <Input 
            name="name" 
            type="text" 
            placeholder="John Doe" 
            icon={<User className="w-4 h-4" />} 
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70 ml-1">Adresse email</label>
          <Input 
            name="email" 
            type="email" 
            placeholder="vous@exemple.com" 
            icon={<Mail className="w-4 h-4" />} 
            required 
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/70 ml-1">Mot de passe</label>
          <Input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            icon={<Lock className="w-4 h-4" />} 
            required 
            minLength={6}
          />
        </div>

        <SubmitButton />
      </form>

      <p className="text-center text-sm text-white/50 mt-8">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-white hover:text-primary-400 transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
