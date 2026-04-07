const BASE_URL = 'http://192.168.1.70:8080/api';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const fetchApi = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { requireAuth = true, ...customConfig } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customConfig.headers,
  };

  if (requireAuth) {
    const authDataRaw = localStorage.getItem('authUser');
    if (authDataRaw) {
      try {
        const authData = JSON.parse(authDataRaw);
        if (authData.token) {
          headers['Authorization'] = `Bearer ${authData.token}`;
        }
      } catch (e) {
        console.error("Failed to parse auth token", e);
      }
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new ApiError(errorMessage, response.status);
    }

    // For 204 or empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('Network error or completely unreachable API');
  }
};

export default {
  get: <T>(endpoint: string, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: FetchOptions) => fetchApi<T>(endpoint, { ...options, method: 'DELETE' })
};
