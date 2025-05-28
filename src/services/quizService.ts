import { QuizType } from "@/types/api.type";
import api from "./api"

export const getAllQuiz = async(): Promise<QuizType[]> => {
    const response = await api.get(`/quiz`);
    return response.data.quizzes;
}
export const getQuizQuestion = async(id: string): Promise<any> => {
    const response = await api.get(`/quiz/${id}`);
    return response.data.quizzes[0];
}