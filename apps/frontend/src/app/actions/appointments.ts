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

export async function setAvailability(availabilities: Array<{ dayOfWeek: number; startTime: string; endTime: string }>) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/appointments/availability`, {
      method: 'POST',
      headers,
      body: JSON.stringify(availabilities),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: 'Failed to set availability' };
  }
}

export async function getAvailability(providerId: string) {
  try {
    const res = await fetch(`${API_URL}/appointments/availability/${providerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: 'Failed to get availability' };
  }
}

export async function bookAppointment(data: { providerId: string; dateTime: string; notes?: string }) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/appointments/book`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: 'Failed to book appointment' };
  }
}

export async function getProviderBookings() {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/appointments/provider`, {
      method: 'GET',
      headers,
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: 'Failed to get provider bookings' };
  }
}

export async function getClientBookings() {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/appointments/client`, {
      method: 'GET',
      headers,
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: 'Failed to get client bookings' };
  }
}

export async function updateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/appointments/status/${bookingId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: 'Failed to update booking status' };
  }
}

export async function createVideoSession(bookingId: string) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/video/session`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ bookingId }),
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: 'Failed to create video session' };
  }
}

export async function getVideoSession(bookingId: string) {
  try {
    const headers = await getHeaders();
    const res = await fetch(`${API_URL}/video/session/${bookingId}`, {
      method: 'GET',
      headers,
    });
    const data = await res.json();
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: 'Failed to get video session' };
  }
}
