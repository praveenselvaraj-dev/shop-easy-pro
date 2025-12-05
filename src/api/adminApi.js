import adminClient from "./clients/adminClient";


export const adminApi = {
  analytics: (from_date, to_date) =>
    adminClient.get("/sales", { params: { from_date: from_date, to_date: to_date } }),

  lowStock: (threshold) =>
    adminClient.get("/low-stock", { params: { threshold } }),

  adminProducts: () => adminClient.get("/products"),
  adminOrders: () => adminClient.get("/orders"),
};

