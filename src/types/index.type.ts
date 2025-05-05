import { CategoryRole, Company, UserRole } from "./enum.type";

export interface LoginFormData {
  email: string;
  password: string;
}
export interface SignupFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
  group: string;
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
  image: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}
export interface Group {
  _id: string;
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
  practice: string | number;
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
