export const API_URL = import.meta.env.VITE_API_URL;
export const API_PURCHASE = import.meta.env.VITE_API_PURCHASE;
export const API_ACTIVITY = import.meta.env.VITE_API_ACTIVITY;
export const API_AUTH = import.meta.env.VITE_API_AUTH;
export const API_ACCOUNT = import.meta.env.VITE_API_ACCOUNT;
export const API_SCHOOL = import.meta.env.VITE_API_SCHOOL;
export const API_SCHOOLS = import.meta.env.VITE_API_SCHOOLS;
export const API_UPLOAD = import.meta.env.VITE_API_UPLOAD;
export const API_PUBLIC_ALL = import.meta.env.VITE_API_PUBLIC_ALL;
export const API_PUBLIC = import.meta.env.VITE_API_PUBLIC;
export const API_NISN = import.meta.env.VITE_API_NISN;
export const API_USERS = import.meta.env.VITE_API_USERS;


export function buildApiUrl(endpoint: string) {
  return `${API_URL}${endpoint}`;
}
