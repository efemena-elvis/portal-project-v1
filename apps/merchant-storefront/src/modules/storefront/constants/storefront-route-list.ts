// STOREFRONT ROUTE MAP
const storefrontRouteMap = {
  store: [
    {
      name: "Store",
      route: "SetupStoreDetails",
      title: "Tell us more about your store",
      description:
        "Let's get to quickly setup your storefront for customer engagement",
    },
  ],

  contact: [
    {
      name: "Contact",
      route: "SetupContactDetails",
      title: "How can we contact your store?",
      description:
        "Share your store contact information to ensure a smooth communication when needed.",
    },
  ],

  payment: [
    {
      name: "Bank Account",
      route: "SetupPaymentDetails",
      title: "Payment details",
      description:
        "Provide a bank details where your collected funds would be settled into.",
    },
  ],

  identification: [
    {
      name: "Documents",
      route: "SetupIdentificationDetails",
      title: "Personal identification documents",
      description:
        "Provide your personal identification documents, so Storo can verify your identity.",
    },
  ],
};

export const storefrontRouteList = [
  {
    name: "Store Information",
    route: "SetupStoreDetails",
    category: "store",
    metadata: storefrontRouteMap.store,
  },
  {
    name: "Contact Details",
    route: "SetupContactDetails",
    category: "contact",
    metadata: storefrontRouteMap.contact,
  },
  {
    name: "Bank Account",
    route: "SetupPaymentDetails",
    category: "payment",
    metadata: storefrontRouteMap.payment,
  },
  {
    name: "Personal Identification",
    route: "SetupIdentificationDetails",
    category: "identification",
    metadata: storefrontRouteMap.identification,
  },
];
