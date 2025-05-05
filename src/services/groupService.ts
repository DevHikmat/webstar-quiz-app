import { Group, GroupFormData } from "../types/index.type";
import api from "./api"

export const createGroup = async (formdata: GroupFormData):Promise<any> => {
  const res = await api.post(`/group`, formdata);
  return res.data;
}

export const getAllGroup = async ():Promise<{groups: Group[], message: string}> => {
  const res = await api.get(`/group`);
  return res.data;
}

export const getTeacherGroup = async (teacherId:string):Promise<Group[]> => {
  const res = await api.get(`/group/teacher/${teacherId}`);
  return res.data;
}

export const changeGroupAccess = async (groupId:string):Promise<any> => {
  const res = await api.patch(`/group/access/${groupId}`);
  return res.data;
}