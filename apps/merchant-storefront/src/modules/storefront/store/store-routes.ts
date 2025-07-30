
export const storeRoutes = {
  createStorefront: `store/create`,
  getStoreList: `store/list`,
  getStoreDetails: `store/details`,
  getStoreCustomers: `store/customers/:store_id`,
  getStoreProducts: `store/products`,
  addProduct: `store/product/create`,
  updateStoreProduct: `store/product/edit`,
  deleteProduct: `store/product/:id`,
  getProductsSummary: `store/product/summary/:store_id`,
  getStoreOrders: `store/orders/store/:store_id`,
  updateOrderStatus: `orders/status`,
  viewOrderDetails: `orders/view/:id`,
  searchProductorOrder: `store/product/search`,
};
