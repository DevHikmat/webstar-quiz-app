import { axiosInstance } from "./axiosInstance";

export const CategoryService = {
  async getAllCategory() {
    const res = await axiosInstance.get("/category");
    return res.data;
  },
  async createCategory(formData) {
    const res = await axiosInstance.post("/category", formData);
    return res.data;
  },
  async updateCategory(formData, id) {
    const res = await axiosInstance.put(`/category/${id}`, formData);
    return res.data;
  },
  async deleteCategory(id) {
    const res = await axiosInstance.delete(`/category/${id}`);
    return res.data;
  },
};
