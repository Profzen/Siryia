'use server';

import { cookies } from 'next/headers';
import api from '@/lib/api';

export async function createCompany(data: {
  name: string;
  isInformal?: boolean;
  bio?: string;
  phone?: string;
  email?: string;
  rccm?: string;
  taxId?: string;
  address?: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siryia_token')?.value;

    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    const response = await api.post('/companies', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la création de la structure:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la création de la structure',
    };
  }
}

export async function getMyCompanies() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siryia_token')?.value;

    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    const response = await api.get('/companies/my', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des structures:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la récupération des structures',
    };
  }
}

export async function updateCompany(
  id: string,
  data: Partial<{
    name: string;
    isInformal: boolean;
    bio: string;
    phone: string;
    email: string;
    rccm: string;
    taxId: string;
    address: string;
  }>,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siryia_token')?.value;

    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    const response = await api.patch(`/companies/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la modification de la structure:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la modification de la structure',
    };
  }
}

export async function inviteMember(id: string, email: string, role: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siryia_token')?.value;

    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    const response = await api.post(
      `/companies/${id}/invite`,
      { email, role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de l\'invitation:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de l\'invitation',
    };
  }
}
