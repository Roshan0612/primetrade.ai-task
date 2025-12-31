const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const apiCall = async <T = unknown>(
  endpoint: string,
  options: RequestInit & { headers?: Record<string, string> } = {}
): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: { message: `HTTP ${response.status}` } };
    }

    const message = errorData.error?.message || `API error: ${response.status}`;
    const code = errorData.error?.code || 'API_ERROR';

    // Handle token expiration
    if (response.status === 401 && (code === 'TOKEN_EXPIRED' || message.includes('expired'))) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login?expired=true';
      }
    }

    const error = new ApiError(response.status, code, message);
    throw error;
  }

  return response.json();
};
