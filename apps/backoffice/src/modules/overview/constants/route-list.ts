// MARKET ROUTE MAP
const marketRouteMap = {
  entry: [
    {
      name: "Wallet",
      route: "VesicashWalletEntry",
      title: "Setup a market collection wallet",
      description:
        "Make a selection of a wallet currency to start receiving payments and managing your market collections.",
    },
  ],

  document: [
    {
      name: "Wallet",
      route: "VesicashWalletDocument",
      title: "Business registration documents",
      description:
        "Provide your registered business documents, so Vesicash can verify your business information.",
    },
  ],
  status: [
    {
      name: "Wallet",
      route: "VesicashWalletStatus",
      title: "",
      description: "",
    },
  ],
};

export const marketRouteList = [
  {
    name: "Entry",
    route: "VesicashWalletEntry",
    category: "entry",
    metadata: marketRouteMap.entry,
  },
  {
    name: "Document",
    route: "VesicashWalletDocument",
    category: "document",
    metadata: marketRouteMap.document,
  },
  {
    name: "Status",
    route: "VesicashWalletStatus",
    category: "status",
    metadata: marketRouteMap.status,
  },
];
