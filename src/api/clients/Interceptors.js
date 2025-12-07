export function setupInterceptors(client) {
  // ------ REQUEST ------
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ------ RESPONSE ------
  client.interceptors.response.use(
    (response) => response,

    async (error) => {
      const status = error.response?.status;
      const original = error.config;

      // Retry only once for network/5xx errors
      const retryable = (status >= 500 || status === 0 || !status);

      if (!original._retry && retryable) {
        original._retry = true;
        return client(original);
      }

      // Token expired or unauthorized
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );

  return client;
}
