import { LoginFormData, SignupFormData, User } from "../types/index.type";
import api from "./api";

interface LoginResponse {
  user: User;
  token: string;
}

export const login = async (formdata: LoginFormData):Promise<LoginResponse> => {
  const res = await api.post(`/auth/login`, formdata);
  return res.data;
};
export const signup = async (formdata: SignupFormData):Promise<any> => {
  const res = await api.post(`/auth/signup`, formdata);
  return res.data;
};
export const getMe = async (): Promise<any> => {
  const res = await api.post(`/user/me`); 
  return res.data;
};