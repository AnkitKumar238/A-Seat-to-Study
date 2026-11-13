// Base API URL configuration with production fallback and normalization
const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://a-seat-to-study-api.vercel.app/api'
    : 'http://localhost:5000/api');

// Strip trailing slashes
let cleanBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');

// Ensure /api suffix is present without duplication
if (!cleanBaseUrl.endsWith('/api')) {
  cleanBaseUrl = `${cleanBaseUrl}/api`;
}

export const API_BASE_URL = cleanBaseUrl;

/**
 * Standard HTTP Client wrapper for API communication.
 */
export async function apiClient(endpoint, options = {}) {
  // Ensure single leading slash and strip duplicate /api prefix if passed
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.slice(4);
  }

  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  // Retrieve auth token if present
  const token = localStorage.getItem('study_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Authentication Endpoints
 */
export const authAPI = {
  login: async (identifier, password) => {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  register: async (userData) => {
    return apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return apiClient('/auth/me', {
      method: 'GET',
    });
  },

  logout: async () => {
    return apiClient('/auth/logout', {
      method: 'POST',
    });
  },

  adminCheck: async () => {
    return apiClient('/auth/admin-check', {
      method: 'GET',
    });
  },
};

/**
 * Seat & Map Endpoints
 */
export const seatAPI = {
  getSeats: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/seats${query ? `?${query}` : ''}`);
  },

  getSeat: async (seatNumber) => {
    return apiClient(`/seats/${seatNumber}`);
  },

  getTelemetry: async (floor = 2) => {
    return apiClient(`/seats/telemetry?floor=${floor}`);
  },
};

/**
 * Reservation & Booking Endpoints
 */
export const reservationAPI = {
  create: async (reservationData) => {
    return apiClient('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },

  getMy: async () => {
    return apiClient('/reservations/my');
  },

  getAnalytics: async () => {
    return apiClient('/reservations/analytics');
  },

  checkIn: async (id) => {
    return apiClient(`/reservations/${id}/check-in`, {
      method: 'PATCH',
    });
  },

  extend: async (id, additionalMinutes = 30) => {
    return apiClient(`/reservations/${id}/extend`, {
      method: 'PATCH',
      body: JSON.stringify({ additionalMinutes }),
    });
  },

  cancel: async (id) => {
    return apiClient(`/reservations/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  sweepGrace: async () => {
    return apiClient('/reservations/sweep-grace-expired', {
      method: 'POST',
    });
  },
};

/**
 * Administration & Operations Endpoints
 */
export const adminAPI = {
  getOverview: async () => {
    return apiClient('/admin/overview');
  },

  getBookings: async () => {
    return apiClient('/admin/bookings');
  },

  overrideSeatStatus: async (seatNumber, status, note) => {
    return apiClient(`/admin/seats/${seatNumber}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  waiveStrike: async (studentId, reason) => {
    return apiClient(`/admin/students/${studentId}/waive-strike`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  toggleGate: async (gateId) => {
    return apiClient(`/admin/turnstiles/${gateId}/toggle`, {
      method: 'POST',
    });
  },

  getExportUrl: () => {
    return `${API_BASE_URL}/admin/export/audit.csv`;
  },
};

/**
 * Check backend health status
 */
export async function checkServerHealth() {
  return apiClient('/health');
}

export default { apiClient, authAPI, seatAPI, reservationAPI, adminAPI, checkServerHealth };
