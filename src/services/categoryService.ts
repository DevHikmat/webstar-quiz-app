import { CategoryFormData } from "../types/api.type";
import api from "./api";

export const createCategory = async (formdata: CategoryFormData): Promise<any> => {
  const res = await api.post(`/category`, formdata);
  return res.data;
};

export const updateCategory = async (categoryId: string, formdata: Partial<CategoryFormData>): Promise<any> => {
  const res = await api.put(`/category/${categoryId}`, formdata);
  return res.data;
};

export const getAllCategory = async (): Promise<any> => {
  const res = await api.get(`/category`);
  return res.data.categories;
};

export const deleteCategory = async (categoryId: string): Promise<any> => {
  const res = await api.delete(`/category/${categoryId}`);
  return res.data;
};