import { HistoryFormData } from "../types/index.type";
import api from "./api"


export const createHistory = async (formdata: HistoryFormData): Promise<any> => {
  const res = await api.post(`/history`, formdata);
  return res.data;
}

export const updateHistory = async (historyId: string, formdata: { practice: string }): Promise<any> => {
  const res = await api.put(`/history/${historyId}`, formdata);
  return res.data;
}

export const deleteHistory = async (histroyId: string): Promise<any> => {
  const res = await api.delete(`/history/${histroyId}`);
  return res.data;
}