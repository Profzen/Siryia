"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function getKycStatus() {
  const cookieStore = await cookies();
  const token = cookieStore.get("siryia_token")?.value;

  if (!token) return { kycLevel: 1, kycStatus: "PENDING", documents: [] };

  try {
    const res = await fetch(`${API_URL}/kyc/status`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Erreur récupération statut KYC");
    return await res.json();
  } catch (error) {
    console.error(error);
    return { kycLevel: 1, kycStatus: "PENDING", documents: [] };
  }
}

export async function uploadKycDocument(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("siryia_token")?.value;

  if (!token) return { success: false, error: "Non autorisé" };

  try {
    const res = await fetch(`${API_URL}/kyc/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, error: errorData.message || "Erreur lors de l'envoi" };
    }

    revalidatePath("/dashboard/kyc");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Impossible de joindre le serveur" };
  }
}
