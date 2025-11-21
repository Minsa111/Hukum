export const API_URL = import.meta.env.VITE_API_URL;
export const API_PURCHASE = import.meta.env.VITE_API_PURCHASE;
export const API_ACTIVITY = import.meta.env.VITE_API_ACTIVITY;
export const API_SCHOOL = import.meta.env.VITE_API_SCHOOL;
export const API_UPLOAD = import.meta.env.VITE_API_UPLOAD;
export const API_PUBLIC_ALL = import.meta.env.VITE_API_PUBLIC_ALL;
export const API_PUBLIC = import.meta.env.VITE_API_PUBLIC;
export const API_NISN = import.meta.env.VITE_API_NISN;


export function buildApiUrl(endpoint: string) {
  return `${API_URL}${endpoint}`;
}
