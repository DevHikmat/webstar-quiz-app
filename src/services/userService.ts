import { User } from "../types/api.type";
import api from "./api";

export const getOneUser = async (userId: string): Promise<User> => {
  const res = await api.get(`/user/${userId}`);
  return res.data;
};

export const getStudents = async (studentId: string | number): Promise<{users: User[], totalPage: number}> => {
  const res = await api.get(`/user/student/${studentId}`);
  return res.data;
};

export const getGroupStudents = async (groupId: string): Promise<User[]> => {
  const res = await api.get(`/user/group/${groupId}`);
  return res.data;
};

export const getTeachers = async (): Promise<User[]> => {
  const res = await api.get(`/user/teacher/list`);
  return res.data;
};

export const searchStudent = async (searchTerm: string): Promise<User[]> => {
  const res = await api.get(`/user/search/student`, {
    params: { searchTerm },
  });
  return res.data;
};

export const deleteUser = async (userId: string): Promise<any> => {
  const res = await api.delete(`/user/${userId}`);
  return res.data;
};

export const updateUser = async (userId: string, formdata: Partial<User>): Promise<any> => {
  const res = await api.put(`/user/${userId}`, formdata);
  return res.data;
};
