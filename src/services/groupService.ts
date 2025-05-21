import { Group, GroupFormData } from "../types/index.type";
import api from "./api";

export const createGroup = async (formdata: GroupFormData): Promise<any> => {
  const res = await api.post(`/group`, formdata);
  return res.data;
};

export const getAllGroup = async (): Promise<Group[]> => {
  const res = await api.get(`/group`);
  return res.data.groups;
};
export const deleteGroup = async (groupId: string): Promise<Group> => {
  const res = await api.delete(`/group/${groupId}`);
  return res.data;
};

export const getTeacherGroup = async (teacherId: string): Promise<Group[]> => {
  const res = await api.get(`/group/teacher/${teacherId}`);
  return res.data;
};

export const updateGroup = async ({ id, data }: { id: string; data: Partial<Group> }): Promise<Group> => {
  const response = await api.patch(`/group/${id}`, data);
  return response.data;
};
