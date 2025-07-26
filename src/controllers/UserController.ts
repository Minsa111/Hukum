import type{ User } from '../models/User';

export const fetchUsers = async (): Promise<User[]> => {
  // Simulated API call
  return [
    { id: 1, name: "Amin", email: "amin@example.com" },
    { id: 2, name: "Dina", email: "dina@example.com" }
  ];
};
