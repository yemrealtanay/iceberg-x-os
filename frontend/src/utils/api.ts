const API_BASE = window.location.origin.includes(':5173')
  ? 'http://localhost:5001/api'
  : '/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('iceberg_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
    
  delete: <T = any>(endpoint: string, headers?: Record<string, string>) => 
    request<T>(endpoint, { method: 'DELETE', headers }),
};
