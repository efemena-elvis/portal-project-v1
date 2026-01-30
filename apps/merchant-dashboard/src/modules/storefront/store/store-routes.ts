const nameSpace: string = "storefront";

export const storeRoutes = {
  createStorefront: "store/create",
  fetchStorefront: "store/list",
  fetchStoreById: "store",
  updateStorefront: "store/edit",
  deleteStorefront: "store",

  getProducts: "store/products",
  addProducts: "store/product/create",
  editProduct: "store/product/edit",
  deleteProduct: "store/product",

  getOrders: "store/orders/store",
  updateOrderStatus: "store/orders/status",
  viewOrderDetails: "orders/view",
};
