export const API_BASE = window.location.origin.includes(':5173')
  ? 'http://localhost:5001/api'
  : '/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('iceberg_token');
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...options.headers,
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = isFormData ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (!response.ok) {
    // The token lasts 24h. Without this, an expired session showed a generic
    // error on every page instead of sending the user back to sign in.
    if (response.status === 401 && token && !endpoint.startsWith('/auth/login')) {
      localStorage.removeItem('iceberg_token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
      throw new Error('Your session has expired. Please sign in again.');
    }

    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error || `HTTP error! status: ${response.status}`) as Error & {
      status?: number;
      details?: any;
    };
    error.status = response.status;
    error.details = errorData.details;
    throw error;
  }

  return response.json();
}

export const api = {
  get: <T = any>(endpoint: string, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: 'GET', headers }),
    
  post: <T = any>(endpoint: string, body: any, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: 'POST', body, headers }),
    
  put: <T = any>(endpoint: string, body: any, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: 'PUT', body, headers }),
    
  patch: <T = any>(endpoint: string, body: any, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: 'PATCH', body, headers }),
    
  delete: <T = any>(endpoint: string, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: 'DELETE', headers }),

  upload: <T = any>(endpoint: string, formData: FormData, method = 'POST') =>
    request<T>(endpoint, { method, body: formData }),

  downloadBlob: async (endpoint: string): Promise<{ blob: Blob; filename: string }> => {
    const token = localStorage.getItem('iceberg_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${endpoint}`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Failed to download file: ${res.statusText}`);
    }

    const disposition = res.headers.get('Content-Disposition') || '';
    let filename = 'document.pdf';
    const match = disposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i);
    if (match && match[1]) {
      try {
        filename = decodeURIComponent(match[1]);
      } catch {
        filename = match[1];
      }
    }

    const blob = await res.blob();
    return { blob, filename };
  }
};
