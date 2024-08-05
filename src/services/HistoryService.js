import { axiosInstance } from "./axiosInstance";

export const HistoryService = {
  async addHistory(formdata) {
    const { data } = await axiosInstance.post("/history", formdata);
    return data;
  },
  async updateHistory(id, formdata) {
    const { data } = await axiosInstance.put(`/history/${id}`, formdata);
    return data;
  },
  async deleteHistory(id) {
    const { data } = await axiosInstance.delete(`/history/${id}`);
    return data;
  },
};
