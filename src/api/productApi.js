import productClient from "./clients/productClient";

export const productApi = {
  list: (params) => productClient.get("Product/", { params }),
  get: (id) => productClient.get(`Product/${id}`),
  create: (data) => productClient.post("Product/", data),
  update: (id, data) => productClient.put(`Product/${id}`, data),
  remove: (id) => productClient.delete(`Product/${id}`),
};
