import { API_URL } from "@/api/api";


export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  let token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    Authorization: token ? `Bearer ${token}` : "",
    ...options.headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);

    if (refreshed) {
      token = localStorage.getItem("token");
      const retryHeaders: HeadersInit = {
        Authorization: `Bearer ${token}`,
        ...options.headers,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      };
      response = await fetch(url, { ...options, headers: retryHeaders });
    } else {
      console.warn("Session expired. Redirecting to login...");
      localStorage.clear();
      window.location.href = "/auth/login";
      return;
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}



async function refreshAccessToken(refreshToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return false;
  }
}
