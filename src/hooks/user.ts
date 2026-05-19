import axios from "axios";
import type { User } from "../types/user";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = async (): Promise<any[]> => {
  const response = await axios.get(`${BASE_URL}/users/`);
  return response.data;
};

export const createUser = async (user: Omit<User, "_id">): Promise<User> => {
  const response = await axios.post(`${BASE_URL}/users/`, user);
  return response.data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await axios.put(`${BASE_URL}/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/users/${id}`);
};
