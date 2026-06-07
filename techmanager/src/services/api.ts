const API_BASE_URL = 'https://localhost:8443';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData: any = {};
    try { errorData = JSON.parse(errorText); } catch { errorData = { message: errorText }; }
    throw { status: response.status, ...errorData };
  }

  // Lê como texto primeiro — evita explodir em respostas Void (200 sem body)
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return null; }
}

export function getUserRole(): 'ADMIN' | 'CUSTOMER' | 'TECHNICAL' | null {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.roles?.[0]?.replace('ROLE_', '');
    return role || null;
  } catch {
    return null;
  }
}

export const api = {

  auth: {
    login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  },
  admin: {
    getCustomers: () => request('/admin/customer/findAll'),
    deleteCustomer: (id: string) => request(`/admin/customer/delete/${id}`, { method: 'DELETE' }),
    updateCustomer: (id: string, data: any) => request(`/admin/customer/update/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    getTechnicians: () => request('/admin/technical/findAll'),
    createTechnical: (data: any) => request('/admin/technical/create', { method: 'POST', body: JSON.stringify(data) }),
    deleteTechnician: (id: string) => request(`/admin/technical/delete/${id}`, { method: 'DELETE' }),
    updateTechnician: (id: string, data: any) => request(`/admin/technical/update/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    getAuditLogs: (page = 0, size = 6) => request(`/api/admin/audit-logs?page=${page}&size=${size}`),
  },
  tickets: {
    getAll: () => request('/ticket/findAll'),
    getMy: () => request('/ticket/findMyTickets'),
    getDetails: (id: string) => request(`/ticket/ticketDetails/${id}`),
    create: (data: any) => request('/ticket/create', { method: 'POST', body: JSON.stringify(data) }),
    start: (id: string) => request(`/ticket/start/${id}`, { method: 'PUT' }),
    cancel: (id: string) => request(`/ticket/cancel/${id}`, { method: 'PUT' }),
    finish: (id: string) => request(`/ticket/finish/${id}`, { method: 'PUT' }),
    assign: (id: string) => request(`/technical/assign/${id}`, { method: 'PUT' }),
    pay: (id: string, data: any) => request(`/ticket/payment/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    changeHistory: (id: string, data: { comment: string }) =>request(`/history/change/${id}`, { method: 'PUT',headers: { 'Content-Type': 'application/json' },body: JSON.stringify(data), }),
  },
  backups: {
    trigger: () => request('/api/backups/trigger', { method: 'POST' }),
    schedule: (data: any) => request('/api/backups/schedule', { method: 'POST', body: JSON.stringify(data) }),
    scheduleStatus: () => request('/api/backups/schedule/status'),
    cancelSchedule: () => request('/api/backups/schedule/cancel', { method: 'DELETE' }),
    restore: (fileName: string) => request(`/api/backups/restore?arquivo=${fileName}`, { method: 'POST' }),
    list: () => request('/api/backups/list'),

  },
};