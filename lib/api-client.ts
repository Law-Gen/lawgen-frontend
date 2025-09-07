import { getSession } from "next-auth/react";

interface ApiRequestOptions extends RequestInit {
  endpoint: string;
  useAuth?: boolean;
}

export async function apiRequest<T = any>({
  endpoint,
  useAuth = true,
  headers = {},
  ...options
}: ApiRequestOptions): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

  let authHeaders = {};

  if (useAuth) {
    const session = await getSession();
    if (session?.accessToken) {
      authHeaders = {
        Authorization: `Bearer ${session.accessToken}`,
      };
    }
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: <T = any>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "endpoint" | "method">
  ) => apiRequest<T>({ endpoint, method: "GET", ...options }),

  post: <T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<ApiRequestOptions, "endpoint" | "method" | "body">
  ) =>
    apiRequest<T>({
      endpoint,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  put: <T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<ApiRequestOptions, "endpoint" | "method" | "body">
  ) =>
    apiRequest<T>({
      endpoint,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }),

  delete: <T = any>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "endpoint" | "method">
  ) => apiRequest<T>({ endpoint, method: "DELETE", ...options }),
};
