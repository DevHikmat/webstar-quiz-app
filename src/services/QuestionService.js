import { axiosInstance } from "./axiosInstance";

export const QuestionService = {
  async getAllQuestions(categoryId, currentPage) {
    const res = await axiosInstance.get(
      `/question/${categoryId}/${currentPage}`
    );
    return res.data;
  },
  async addQuestion(formData) {
    const res = await axiosInstance.post("/question", formData);
    return res.data;
  },
  async updateQuestion(id, formData) {
    const res = await axiosInstance.put(`/question/${id}`, formData);
    return res.data;
  },
  async deleteQuestion(id) {
    const res = await axiosInstance.delete(`/question/${id}`);
    return res.data;
  },
};
