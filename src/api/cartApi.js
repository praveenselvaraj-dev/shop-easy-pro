import cartClient from "./clients/cartClient";

export const cartApi = {
  getCart: () => cartClient.get("Cart/"),
  addToCart: (productId, qty = 1) =>
    cartClient.post("Cart/", { product_id: productId, quantity: qty }),
  updateQty: (itemId, qty) => cartClient.put(`Cart/${itemId}`, { quantity: qty }),
  remove: (itemId) => cartClient.delete(`Cart/${itemId}`),
  removefullcart: () => cartClient.delete("Cart/"),
};
