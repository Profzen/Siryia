'use server';

import api from '@/lib/api';

export async function searchAnnuaire(params: {
  q?: string;
  category?: string;
  type?: 'SOLO' | 'COMPANY';
  verifiedOnly?: boolean;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.category) queryParams.set('category', params.category);
    if (params.type) queryParams.set('type', params.type);
    if (params.verifiedOnly) queryParams.set('verifiedOnly', 'true');

    const response = await api.get(`/annuaire?${queryParams.toString()}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la recherche dans l\'annuaire:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la recherche dans l\'annuaire',
    };
  }
}

export async function getPublicSoloProfile(id: string) {
  try {
    const response = await api.get(`/annuaire/solo/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil solo:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la récupération du profil solo',
    };
  }
}

export async function getPublicCompanyProfile(id: string) {
  try {
    const response = await api.get(`/annuaire/company/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil entreprise:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la récupération du profil entreprise',
    };
  }
}
