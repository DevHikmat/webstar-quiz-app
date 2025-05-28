import { CategoryRole, Company, UserRole } from "./enum.type";

export interface LoginFormData {
  email: string;
  password: string;
}
export interface SignupFormData {
  subject?: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
  group?: string;
  profilePicture?: FileList | null;
}
export interface GroupFormData {
  name: string;
  teacherId: string;
  company: Company.WEBSTAR;
}
export interface CategoryFormData {
  name: string;
  type: CategoryRole;
  image: File | null;
}
export interface QuestionFormData {
  quizQuestion: string;
  questionImage?: File | null;
  correctAnswer: string;
  choice1: string;
  choice2: string;
  choice3: string;
  category: string;
}
export interface HistoryFormData {
  type: CategoryRole;
  title: string;
  countQuiz: number;
  correctCount: number;
  userId: string;
}
export interface Category {
  _id: string;
  name: string;
  image: {
    url: string,
    public_id: string;
  }
  type: string;
  createdAt: string;
  updatedAt: string;
}
export interface Group {
  _id: string;
  accessExam: boolean;
  name: string;
  teacherId: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}
export interface History {
  _id: string;
  type: string;
  title: string;
  countQuiz: number;
  correctCount: number;
  userId: string;
  practice: string;
  createdAt: string;
  updatedAt: string;
}
type ProfilePictureType = null | { public_id: string, url: string };
export interface User {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  group: string | null;
  role: UserRole;
  profilePicture: ProfilePictureType;
  history: History[] | [];
  accessExam: boolean;
  subject: string;
  createdAt: string;
  updatedAt: string;
}
export interface QuizType {
  _id: string;
  categoryId: string;
  countQuiz: number;
  createdAt: string;
  quizTime: number;
  title: string;
  updatedAt: string;
  __v: number;
}
export interface Question {
  questionImage: null | string;
  _id: string;
  quizQuestion: string;
  correctAnswer: string;
  choice1: string;
  choice2: string;
  choice3: string;
  category: string;
}
