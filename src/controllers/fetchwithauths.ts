import { API_URL } from "@/api/api";
import { toast } from "sonner";


export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem("token");
  const url = endpoint.startsWith("http")
  ? endpoint
  : `${API_URL}${endpoint}`;
  
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    Authorization: token ? `Bearer ${token}` : "",
    ...options.headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 ) {
    localStorage.clear();
    window.location.href = "/auth/login";
    console.warn("Session expired. Redirecting to login...");
    toast.error("Session expired. Redirecting to login...");
    return;    
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



