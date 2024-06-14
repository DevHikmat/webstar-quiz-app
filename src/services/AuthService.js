import { axiosInstance } from "./axiosInstance";

export const AuthService = {
  async login(user) {
    const res = await axiosInstance.post(`/auth/login`, user);
    return res.data;
  },
  async signup(user) {
    const res = await axiosInstance.post(`/auth/signup`, user);
    return res.data;
  },
};
