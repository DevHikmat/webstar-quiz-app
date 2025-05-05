import { QuestionFormData } from "../types/index.type";
import api from "./api"


export const createQuestion = async (formdata: QuestionFormData): Promise<any> => {
  const res = await api.post(`/question`, formdata);
  return res.data;
}

export const getCategoryQuestion = async (categoryId: string): Promise<any> => {
  const res = await api.get(`/question/${categoryId}`);
  return res.data;
}

export const updateQuestion = async (formdata: Partial<QuestionFormData>): Promise<any> => {
  const res = await api.post(`/question`, formdata);
  return res.data;
}