import orderClient from "./clients/orderClient";

export const orderApi = {
  checkout: (payload) => orderClient.post("Order/checkout", payload),
  myOrders: () => orderClient.get("Order/"),
  getOrder: (id) => orderClient.get(`Order/${id}`),
  analytics: (from_date, to_date) =>
    orderClient.get("admin/Order/sales", { params: { from_date: from_date, to_date: to_date } }),

};
