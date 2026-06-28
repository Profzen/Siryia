'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('siryia_token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function createVehicle(data: any) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to create vehicle' };
  }
}

export async function getVehicles(filters?: { type?: string; make?: string; isForRent?: boolean; isForSale?: boolean }) {
  try {
    const query = new URLSearchParams();
    if (filters?.type) query.append('type', filters.type);
    if (filters?.make) query.append('make', filters.make);
    if (filters?.isForRent !== undefined) query.append('isForRent', String(filters.isForRent));
    if (filters?.isForSale !== undefined) query.append('isForSale', String(filters.isForSale));

    const res = await fetch(`${API_URL}/vehicles?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: 'Failed to fetch vehicles' };
  }
}

export async function rentVehicle(data: { vehicleId: string; startDate: string; endDate: string; totalAmount: number }) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/vehicles/rent`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to rent vehicle' };
  }
}

export async function buyVehicle(vehicleId: string) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/vehicles/buy/${vehicleId}`, {
      method: 'POST',
      headers,
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to buy vehicle' };
  }
}

export async function submitInspection(data: { rentalId: string; vehicleId: string; type: string; checklist: any; photos: string[] }) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/vehicles/inspection`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to submit inspection' };
  }
}
