// API utilities for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Patient APIs
export const patientAPI = {
  getAll: async (page = 1, limit = 10, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append('search', search);
    return fetch(`${API_BASE_URL}/patients?${params}`).then(r => r.json());
  },

  getById: async (id: string) => {
    return fetch(`${API_BASE_URL}/patients/${id}`).then(r => r.json());
  },

  getStats: async () => {
    return fetch(`${API_BASE_URL}/patients/stats/overview`).then(r => r.json());
  },

  create: async (data: any) => {
    return fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  update: async (id: string, data: any) => {
    return fetch(`${API_BASE_URL}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  autoSave: async (id: string, data: any) => {
    return fetch(`${API_BASE_URL}/patients/${id}/autosave`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },
};

// Physical Vitals APIs
export const vitalsAPI = {
  getAll: async (page = 1, limit = 10) => {
    return fetch(`${API_BASE_URL}/physical-vitals?page=${page}&limit=${limit}`).then(r => r.json());
  },

  getByPatientId: async (patientId: string) => {
    return fetch(`${API_BASE_URL}/physical-vitals/patient/${patientId}`).then(r => r.json());
  },

  getLatest: async (patientId: string) => {
    return fetch(`${API_BASE_URL}/physical-vitals/patient/${patientId}/latest`).then(r => r.json());
  },

  getStats: async (patientId: string, days = 30) => {
    return fetch(`${API_BASE_URL}/physical-vitals/patient/${patientId}/stats?days=${days}`).then(r => r.json());
  },

  create: async (data: any) => {
    return fetch(`${API_BASE_URL}/physical-vitals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  update: async (id: string, data: any) => {
    return fetch(`${API_BASE_URL}/physical-vitals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },
};

// Prescriptions APIs
export const prescriptionsAPI = {
  getAll: async (page = 1, limit = 10, isActive?: boolean) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (isActive !== undefined) params.append('is_active', isActive.toString());
    return fetch(`${API_BASE_URL}/prescriptions?${params}`).then(r => r.json());
  },

  getByPatientId: async (patientId: string) => {
    return fetch(`${API_BASE_URL}/prescriptions/patient/${patientId}`).then(r => r.json());
  },

  getActiveByPatientId: async (patientId: string) => {
    return fetch(`${API_BASE_URL}/prescriptions/patient/${patientId}/active`).then(r => r.json());
  },

  getByDoctorId: async (doctorId: string) => {
    return fetch(`${API_BASE_URL}/prescriptions/doctor/${doctorId}`).then(r => r.json());
  },

  getStats: async () => {
    return fetch(`${API_BASE_URL}/prescriptions/stats/overview`).then(r => r.json());
  },

  create: async (data: any) => {
    return fetch(`${API_BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  update: async (id: string, data: any) => {
    return fetch(`${API_BASE_URL}/prescriptions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  complete: async (id: string) => {
    return fetch(`${API_BASE_URL}/prescriptions/${id}/complete`, {
      method: 'PATCH',
    }).then(r => r.json());
  },
};

// Appointments APIs
export const appointmentsAPI = {
  getAll: async (page = 1, limit = 10, status?: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    return fetch(`${API_BASE_URL}/appointments?${params}`).then(r => r.json());
  },

  getByPatientId: async (patientId: string, upcoming?: boolean) => {
    const params = new URLSearchParams();
    if (upcoming) params.append('upcoming', 'true');
    return fetch(`${API_BASE_URL}/appointments/patient/${patientId}?${params}`).then(r => r.json());
  },

  getByDoctorId: async (doctorId: string, date?: string) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    return fetch(`${API_BASE_URL}/appointments/doctor/${doctorId}?${params}`).then(r => r.json());
  },

  checkAvailability: async (doctorId: string, date: string) => {
    return fetch(`${API_BASE_URL}/appointments/availability/${doctorId}?date=${date}`).then(r => r.json());
  },

  getPendingReminders: async () => {
    return fetch(`${API_BASE_URL}/appointments/reminders/pending`).then(r => r.json());
  },

  getStats: async () => {
    return fetch(`${API_BASE_URL}/appointments/stats/overview`).then(r => r.json());
  },

  create: async (data: any) => {
    return fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  update: async (id: string, data: any) => {
    return fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  confirm: async (id: string) => {
    return fetch(`${API_BASE_URL}/appointments/${id}/confirm`, {
      method: 'PATCH',
    }).then(r => r.json());
  },

  cancel: async (id: string) => {
    return fetch(`${API_BASE_URL}/appointments/${id}/cancel`, {
      method: 'PATCH',
    }).then(r => r.json());
  },

  complete: async (id: string) => {
    return fetch(`${API_BASE_URL}/appointments/${id}/complete`, {
      method: 'PATCH',
    }).then(r => r.json());
  },

  markReminderSent: async (id: string, reminderType: string) => {
    return fetch(`${API_BASE_URL}/appointments/${id}/reminder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminder_type: reminderType }),
    }).then(r => r.json());
  },
};

// Notifications APIs
export const notificationsAPI = {
  getAll: async (page = 1, limit = 20, recipientId?: string, isRead?: boolean, type?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (recipientId) params.append('recipient_id', recipientId);
    if (isRead !== undefined) params.append('is_read', isRead.toString());
    if (type) params.append('notification_type', type);
    return fetch(`${API_BASE_URL}/notifications?${params}`).then(r => r.json());
  },

  getByRecipientId: async (recipientId: string, isRead?: boolean) => {
    const params = new URLSearchParams();
    if (isRead !== undefined) params.append('is_read', isRead.toString());
    return fetch(`${API_BASE_URL}/notifications/recipient/${recipientId}?${params}`).then(r => r.json());
  },

  getByPatientId: async (patientId: string, type?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('notification_type', type);
    return fetch(`${API_BASE_URL}/notifications/patient/${patientId}?${params}`).then(r => r.json());
  },

  getUnreadCount: async (recipientId: string) => {
    return fetch(`${API_BASE_URL}/notifications/recipient/${recipientId}/unread-count`).then(r => r.json());
  },

  getStats: async () => {
    return fetch(`${API_BASE_URL}/notifications/stats/overview`).then(r => r.json());
  },

  create: async (data: any) => {
    return fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  update: async (id: string, data: any) => {
    return fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },

  markAsRead: async (id: string) => {
    return fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
    }).then(r => r.json());
  },

  markAllAsRead: async (recipientId: string) => {
    return fetch(`${API_BASE_URL}/notifications/recipient/${recipientId}/read-all`, {
      method: 'PATCH',
    }).then(r => r.json());
  },

  clearReadNotifications: async (recipientId: string) => {
    return fetch(`${API_BASE_URL}/notifications/recipient/${recipientId}/clear-read`, {
      method: 'DELETE',
    }).then(r => r.json());
  },

  sendBulk: async (notifications: any[]) => {
    return fetch(`${API_BASE_URL}/notifications/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifications }),
    }).then(r => r.json());
  },
};
