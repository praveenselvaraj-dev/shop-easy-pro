import apiClient from "./clients/authclient";


export const authApi = {
  login: (payload) => apiClient.post("auth/login", payload),
  register: (payload) => apiClient.post("auth/register", payload),
  profile: () => apiClient.get("users/me"),
};
