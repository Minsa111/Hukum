export const API_URL = import.meta.env.VITE_API_URL;
export const API_PURCHASE = import.meta.env.VITE_API_PURCHASE;

export function buildApiUrl(endpoint: string) {
  return `${API_URL}${endpoint}`;
}
