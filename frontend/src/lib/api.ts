const BASE = import.meta.env.VITE_API_URL || '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export function setAuthToken(token: string) {
  ;(window as any).__authToken = token
}

function authHeaders(): Record<string, string> {
  const token = (window as any).__authToken
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function auth(opts?: RequestInit): RequestInit {
  return { ...opts, headers: { ...authHeaders(), ...(opts?.headers || {}) } }
}

// Users
export const api = {
  users: {
    sync: (data: { email: string; name: string }) =>
      request('/api/users/sync', { method: 'POST', body: JSON.stringify(data), ...auth() }),
    me: () => request('/api/users/me', auth()),
  },

  settings: {
    get: () => request('/api/settings', auth()),
    save: (data: object) =>
      request('/api/settings', { method: 'POST', body: JSON.stringify(data), ...auth() }),
    update: (data: object) =>
      request('/api/settings', { method: 'PATCH', body: JSON.stringify(data), ...auth() }),
  },

  transactions: {
    list: (params?: { month?: number; year?: number; category?: string; type?: string }) => {
      const qs = params ? '?' + new URLSearchParams(params as any).toString() : ''
      return request(`/api/transactions${qs}`, auth())
    },
    create: (data: object) =>
      request('/api/transactions', { method: 'POST', body: JSON.stringify(data), ...auth() }),
    update: (id: string, data: object) =>
      request(`/api/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(data), ...auth() }),
    delete: (id: string) =>
      request(`/api/transactions/${id}`, { method: 'DELETE', ...auth() }),
  },

  goals: {
    list: () => request('/api/goals', auth()),
    create: (data: object) =>
      request('/api/goals', { method: 'POST', body: JSON.stringify(data), ...auth() }),
    update: (id: string, data: object) =>
      request(`/api/goals/${id}`, { method: 'PATCH', body: JSON.stringify(data), ...auth() }),
    delete: (id: string) =>
      request(`/api/goals/${id}`, { method: 'DELETE', ...auth() }),
  },

  events: {
    list: () => request('/api/events', auth()),
    create: (data: object) =>
      request('/api/events', { method: 'POST', body: JSON.stringify(data), ...auth() }),
    delete: (id: string) =>
      request(`/api/events/${id}`, { method: 'DELETE', ...auth() }),
  },

  ai: {
    parseSms: (smsText: string) =>
      request('/api/ai/sms', { method: 'POST', body: JSON.stringify({ smsText }), ...auth() }),
    score: () => request('/api/ai/score', auth()),
    chat: (message: string) =>
      request('/api/ai/chat', { method: 'POST', body: JSON.stringify({ message }), ...auth() }),
  },
}
