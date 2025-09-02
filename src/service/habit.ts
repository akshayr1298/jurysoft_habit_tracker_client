import api from "./api";

export const getAllHabits = async (filter: string, title: string) => {
  try {
    const response = await api.get(`/habit/?filter=${filter}&title=${title}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const addHabits = async (habits: any) => {
  try {
    const response = await api.post(`/habit`, habits);
    return response;
  } catch (error) {
    throw error;
  }
};

export const markDone = async (id:string,) => {
  try {
    const response = await api.patch(`/habit/${id}`,);
    return response;
  } catch (error) {
    throw error;
  }
};

export const reset = async (id:string,) => {
  try {
    const response = await api.patch(`/habit/reset/${id}`,);
    return response;
  } catch (error) {
    throw error;
  }
};
