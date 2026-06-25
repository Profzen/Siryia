"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Identifiants invalides." };
    }

    if (data.access_token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "siryia_token",
        value: data.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      });
      
      // La redirection doit se faire hors du bloc try pour Next.js (sinon NEXT_REDIRECT error caught)
    } else {
      return { error: "Token manquant dans la réponse." };
    }
  } catch (error) {
    console.error("Erreur login:", error);
    return { error: "Erreur de connexion au serveur." };
  }

  redirect("/dashboard");
}

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  if (!email || !password) {
    return { error: "Veuillez remplir tous les champs." };
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Erreur lors de l'inscription." };
    }

    if (data.access_token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "siryia_token",
        value: data.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
  } catch (error) {
    console.error("Erreur register:", error);
    return { error: "Erreur de connexion au serveur." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("siryia_token");
  redirect("/login");
}
