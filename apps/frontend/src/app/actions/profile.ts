'use server'

import { cookies } from 'next/headers';
import api from '@/lib/api';

export async function updateProfile(data: { firstName?: string; lastName?: string; phone?: string; bio?: string }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siryia_token')?.value;

    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    const response = await api.patch('/auth/profile', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
    };
  }
}
