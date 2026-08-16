const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
    public fields?: Record<string, string[] | string>
  ) {
    super(message);
    this.name = 'ApiError';
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
    cache: 'no-store',
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message =
      (typeof body?.error === 'string' ? body.error : body?.error?.message) ??
      body?.message ??
      'Something went wrong';
    const fields = body?.error?.fields ?? body?.fields;
    const details = body?.error?.details ?? body?.details ?? body?.error;

    throw new ApiError(res.status, message, details, fields);
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