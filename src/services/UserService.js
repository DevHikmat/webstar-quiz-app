import { axiosInstance } from "./axiosInstance";

export const UserService = {
  async getStudents(pageNumber) {
    const res = await axiosInstance.get(`/user/student/${pageNumber}`);
    return res.data;
  },
  async getTeachers() {
    const res = await axiosInstance.get("/user/teacher/list");
    return res.data;
  },
  async getOneUser(id) {
    const res = await axiosInstance.get(`/user/${id}`);
    return res.data;
  },
  async deleteUser(id) {
    const res = await axiosInstance.delete(`/user/${id}`);
    return res.data;
  },
  async updateUser(id, user) {
    const res = await axiosInstance.put(`/user/${id}`, user);
    return res.data;
  },
  async searchStudent(searchTerm) {
    const res = await axiosInstance.post(`/user/search/student`, {
      searchTerm,
    });
    return res.data;
  },
};
