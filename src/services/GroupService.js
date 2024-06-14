import { axiosInstance } from "./axiosInstance";

export const GroupService = {
  async getAllGroups() {
    const { data } = await axiosInstance.get(`/group`);
    return data;
  },
  async addGroup(group) {
    const { data } = await axiosInstance.post("/group", group);
    return data;
  },
  async updateGroup(id, group) {
    const { data } = await axiosInstance.patch(`/group/${id}`, group);
    return data;
  },
  async deleteGroupById(id) {
    const { data } = await axiosInstance.delete(`/group/${id}`);
    return data;
  },
  async groupExamToggler(id, access) {
    const { data } = await axiosInstance.patch(`/group/access/${id}`, access);
    return data;
  },
  async getTeacherGroups(id) {
    const res = await axiosInstance.get(`/group/teacher/${id}`);
    return res.data;
  },
  async getGroupStudents(id) {
    const res = await axiosInstance.get(`/user/group/${id}`);
    return res.data;
  },
};
