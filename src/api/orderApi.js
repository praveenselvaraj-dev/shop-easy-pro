import orderClient from "./clients/orderClient";

export const orderApi = {
  checkout: (payload) => orderClient.post("Order/checkout", payload),
  myOrders: () => orderClient.get("Order/"),
  getOrder: (id) => orderClient.get(`Order/${id}`),
};
