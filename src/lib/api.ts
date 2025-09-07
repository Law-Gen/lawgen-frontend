import { getSession } from "next-auth/react";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handle(res: Response) {
  if (!res.ok) {
    let msg = "Request failed";
    try {
      const data = await res.json();
      msg = data.message || JSON.stringify(data);
    } catch {}
    throw new Error(msg);
  }
  return res.json ? res.json() : res.text();
}

function getAuthHeader(sessionAccessToken?: string | null) {
  const tokenFromSession = sessionAccessToken || null;
  let tokenFromStorage: string | null = null;
  if (typeof window !== "undefined") {
    try {
      tokenFromStorage = localStorage.getItem("access_token");
    } catch {}
  }
  const token = tokenFromSession || tokenFromStorage;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  post: async (path: string, body?: any, options: RequestInit = {}) => {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined. Please check your environment variables.");
    }
    const session = await getSession();
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(session?.accessToken as string | undefined),
        ...(options.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...options,
    });
    return handle(res);
  },
  get: async (path: string, options: RequestInit = {}) => {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined. Please check your environment variables.");
    }
    const session = await getSession();
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        ...getAuthHeader(session?.accessToken as string | undefined),
        ...(options.headers || {}),
      },
      credentials: "include",
      ...options,
    });
    return handle(res);
  },
  put: async (path: string, body?: any, options: RequestInit = {}) => {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined. Please check your environment variables.");
    }
    const session = await getSession();
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(session?.accessToken as string | undefined),
        ...(options.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...options,
    });
    return handle(res);
  },
  patch: async (path: string, body?: any, options: RequestInit = {}) => {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined. Please check your environment variables.");
    }
    const session = await getSession();
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(session?.accessToken as string | undefined),
        ...(options.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...options,
    });
    return handle(res);
  },
  refreshToken: async (refreshToken: string) => {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined. Please check your environment variables.");
    }
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "X-Refresh-Token": refreshToken,
      },
      credentials: "include",
    });
    return res;
  },
};
