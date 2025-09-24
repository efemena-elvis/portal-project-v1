const nameSpace = "payment";
export const checkoutRoutes = {
  payment_details: (reference: string) => `${nameSpace}/${reference}`,
  make_momo_payment: (reference: string) => `${nameSpace}/pay/${reference}`,
};
