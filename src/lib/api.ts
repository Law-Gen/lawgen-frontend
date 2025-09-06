export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ;

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

export const api = {
  post: async (path: string, body?: any, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...options,
    });
    return handle(res);
  },
  get: async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: { ...(options.headers || {}) },
      credentials: "include",
      ...options,
    });
    return handle(res);
  },
  refreshToken: async (refreshToken: string) => {
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
