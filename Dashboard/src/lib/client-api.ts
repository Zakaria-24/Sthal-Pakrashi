/**
 * Thin fetch wrapper used by the dashboard's client components. Unwraps the
 * `{ success, data }` envelope and turns failures into thrown Errors carrying
 * the server's message, so callers can just try/catch.
 */

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; message: string; issues?: unknown };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    credentials: "same-origin",
  });

  let payload: ApiEnvelope<T>;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`Server returned ${response.status}`);
  }

  if (!payload.success) {
    throw new Error(payload.message || `Request failed (${response.status})`);
  }
  return payload.data;
}

export type ListResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Record_ = Record<string, any>;

export type ApplicationList<T> = ListResult<T> & {
  counts: Record<string, number>;
};

export const api = {
  list: <T = Record_>(resource: string, params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params)}` : "";
    return request<ListResult<T>>(`/api/${resource}${qs}`);
  },

  create: <T = Record_>(resource: string, body: unknown) =>
    request<T>(`/api/${resource}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: <T = Record_>(resource: string, id: string, body: unknown) =>
    request<T>(`/api/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  remove: (resource: string, id: string) =>
    request<{ deleted: boolean }>(`/api/${resource}/${id}`, {
      method: "DELETE",
    }),

  getSettings: <T = Record_>() => request<T>("/api/settings"),

  getAdmissionInfo: <T = Record_>() => request<T>("/api/admission-info"),

  updateAdmissionInfo: <T = Record_>(body: unknown) =>
    request<T>("/api/admission-info", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  listApplications: <T = Record_>(params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params)}` : "";
    return request<ApplicationList<T>>(`/api/applications${qs}`);
  },

  getApplication: <T = Record_>(id: string) =>
    request<T>(`/api/applications/${id}`),

  updateApplication: <T = Record_>(id: string, body: unknown) =>
    request<T>(`/api/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  removeApplication: (id: string) =>
    request<{ deleted: boolean }>(`/api/applications/${id}`, {
      method: "DELETE",
    }),

  updateSettings: <T = Record_>(body: unknown) =>
    request<T>("/api/settings", { method: "PATCH", body: JSON.stringify(body) }),

  /** Staff sign-in. The super admin uses sendOtp/verifyOtp instead. */
  login: (email: string, password: string) =>
    request<{ id: string; name: string; email: string; role: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    ),

  sendOtp: (email: string) =>
    request<{
      sent: boolean;
      expiresInMinutes: number;
      delivery: "email" | "console";
    }>("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyOtp: (email: string, code: string) =>
    request<{ id: string; name: string; email: string; role: string }>(
      "/api/auth/verify-otp",
      { method: "POST", body: JSON.stringify({ email, code }) },
    ),

  listUsers: <T = Record_>() => request<ListResult<T>>("/api/users"),

  createUser: (body: unknown) =>
    request<Record_>("/api/users", { method: "POST", body: JSON.stringify(body) }),

  updateUser: (id: string, body: unknown) =>
    request<Record_>(`/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteUser: (id: string) =>
    request<{ deleted: boolean }>(`/api/users/${id}`, { method: "DELETE" }),

  logout: () => request<{ loggedOut: boolean }>("/api/auth/logout", {
    method: "POST",
  }),

  upload: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });
    const payload = (await response.json()) as ApiEnvelope<{ url: string }>;
    if (!payload.success) throw new Error(payload.message);
    return payload.data;
  },
};
