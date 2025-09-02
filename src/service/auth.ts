import api from "./api";

export const register = async (data: any) => {
  try {
    const response = await api.post("/auth/signup", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const profile = async () => {
  try {
    const response = await api.get("/profile");
    return response;
  } catch (error) {
    throw error;
  }
};
