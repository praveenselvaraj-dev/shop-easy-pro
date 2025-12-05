import profileClient from "./clients/profileClient";

export const profileApi = {
  get: (id) => profileClient.get(`users/me`),
  update: (id, data) => profileClient.put(`users/${id}`, data),
  remove: (id) => profileClient.delete(`users/${id}`),
};