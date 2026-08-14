const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    credentials: 'include', // sends the httpOnly refresh cookie
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(res.status, body?.error?.message ?? 'Something went wrong', body?.error?.details);
  }

  return body as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) => apiFetch<T>(path, { method: 'GET', token }),
  post: <T>(path: string, data?: unknown, token?: string | null) =>
    apiFetch<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined, token }),
  patch: <T>(path: string, data?: unknown, token?: string | null) =>
    apiFetch<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined, token }),
  delete: <T>(path: string, token?: string | null) => apiFetch<T>(path, { method: 'DELETE', token }),
};

export { ApiError };