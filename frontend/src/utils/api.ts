/**
 * FRONTEND REST API UTILITY CLIENT
 * 
 * Purpose: Provides functions to communicate with the REST API backend (on port 5000) for managing venues,
 * applications, documents, and profile actions.
 * 
 * Command lines to execute/build/test this project:
 * - Start Vite Frontend Dev Server:
 *   npm run dev
 * - Build Frontend bundle:
 *   npm run build
 * - Run Frontend Unit Tests:
 *   npm run test
 */

import type { Venue, Application, HirerDocuments } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('vv_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Venues
  getVenues: async (params?: { search?: string; location?: string; capacity?: string; suitability?: string }): Promise<Venue[]> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/venues?${query}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch venues');
    return res.json();
  },

  getVenueById: async (id: string): Promise<Venue> => {
    const res = await fetch(`${API_BASE}/venues/${id}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch venue details');
    return res.json();
  },

  updateVenue: async (id: string, venueData: Partial<Venue>): Promise<{ message: string; venue: Venue }> => {
    const res = await fetch(`${API_BASE}/venues/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(venueData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update venue');
    return data;
  },

  createVenue: async (venueData: Partial<Venue>): Promise<{ message: string; venue: Venue }> => {
    const res = await fetch(`${API_BASE}/venues`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(venueData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create venue');
    return data;
  },

  deleteVenue: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/venues/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete venue');
    return data;
  },

  // Applications
  getApplications: async (): Promise<Application[]> => {
    const res = await fetch(`${API_BASE}/applications`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  submitApplication: async (appData: {
    venueId: string;
    eventName: string;
    guestCount: number;
    eventDate: string;
    eventTime: string;
    durationHours: number;
  }): Promise<{ message: string; application: Application }> => {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit application');
    return data;
  },

  updateApplicationStatus: async (
    id: string,
    status: 'approved' | 'rejected',
    vendorComment: string,
    rating?: number
  ): Promise<{ message: string; application: Application }> => {
    const res = await fetch(`${API_BASE}/applications/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, vendorComment, rating }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update application status');
    return data;
  },

  getDocuments: async (): Promise<HirerDocuments> => {
    const res = await fetch(`${API_BASE}/documents`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  getDocumentsByHirerId: async (hirerId: string): Promise<HirerDocuments> => {
    const res = await fetch(`${API_BASE}/documents/${hirerId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch documents for hirer');
    return res.json();
  },

  saveDocuments: async (docData: Partial<HirerDocuments>): Promise<{ message: string; document: HirerDocuments }> => {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(docData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save documents');
    return data;
  },

  // Analytics & History
  getVendorAnalytics: async (): Promise<{
    analyticsData: Array<{ name: string; selected: number }>;
    mostSelectedApplicants: Array<{ name: string; selected: number }>;
    leastSelectedApplicants: Array<{ name: string; selected: number }>;
    neverSelectedApplicants: Array<{ name: string; selected: number }>;
    chartColours: string[];
    pieChartData: Array<{ name: string; value: number }>;
  }> => {
    const res = await fetch(`${API_BASE}/analytics/vendor`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch vendor analytics');
    return res.json();
  },

  getHistoryByHirer: async (hirerId: string): Promise<{
    history: any[];
    reputation: number;
    historyCount: number;
  }> => {
    const res = await fetch(`${API_BASE}/analytics/history/${hirerId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch hire history');
    return res.json();
  },

  // Profile update
  updateProfile: async (name: string, phone: string, avatarUrl?: string): Promise<{ message: string; user: any }> => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name, phone, avatarUrl }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },
};
