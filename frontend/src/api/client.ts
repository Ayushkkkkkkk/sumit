const API_BASE_URL = "http://localhost:4000/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT";
  token?: string | null;
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.message ?? "Request failed");
  }

  return json as T;
}
