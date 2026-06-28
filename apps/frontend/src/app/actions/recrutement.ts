'use server';

import { cookies } from 'next/headers';
import api from '@/lib/api';

export async function createServiceRequest(data: {
  title: string;
  description: string;
  budget?: number;
  categoryId: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siryia_token')?.value;

    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    const response = await api.post('/recrutement/requests', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la création du besoin:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la création du besoin',
    };
  }
}

export async function getServiceRequests() {
  try {
    const response = await api.get('/recrutement/requests');
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des besoins:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la récupération des besoins',
    };
  }
}

export async function getServiceRequestDetails(id: string) {
  try {
    const response = await api.get(`/recrutement/requests/${id}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des détails du besoin:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la récupération des détails du besoin',
    };
  }
}

export async function submitProposal(requestId: string, data: {
  amount: number;
  message: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siryia_token')?.value;

    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    const response = await api.post(`/recrutement/requests/${requestId}/proposals`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de la soumission de la proposition:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de la soumission de la proposition',
    };
  }
}

export async function acceptProposal(proposalId: string, paymentDetails: { providerName: string; phone: string }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('siryia_token')?.value;

    if (!token) {
      return { success: false, error: 'Non authentifié' };
    }

    const response = await api.patch(`/recrutement/proposals/${proposalId}/accept`, paymentDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Erreur lors de l\'acceptation de la proposition:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Erreur lors de l\'acceptation de la proposition',
    };
  }
}
