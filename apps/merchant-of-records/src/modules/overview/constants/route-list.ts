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

// Merchant onboarding

// ONBOARDING ROUTE MAP
const onboardingRouteMap = {
  business: [
    {
      name: "Profile",
      route: "MerchantBusinessProfile",
      title: "Tell us more about your business",
      description:
        "As a financial service company, we would need to verify your business registration information",
    },
  ],
  address: [
    {
      name: "Address",
      route: "MerchantBusinessAddress",
      title: "Tell us more about your business",
      description:
        "Provide your business address details so we can identify your physical location for compliance and verification purposes",
    },
  ],
  registration: [
    {
      name: "Documents",
      route: "BusinessDocuments",
      title: "Business registration documents",
      description:
        "Provide your registered business documents, so Vesicash can verify your business information.",
    },
  ],
  director1: [
    {
      name: "Director 1",
      route: "DirectorDetails1",
      title: "Let's meet director 1",
      description: "Provide the profile details of the first company director.",
    },
 
  ],
  director2: [
    {
      name: "Director 2",
      route: "DirectorDetails2",
      title: "Let's meet director 2",
      description: "Provide the profile details of the second company director.",
    },
 
  ],

  ubo1: [
    {
      name: "Ultimate Business Owner 1",
      route: "UboDetails1",
      title: "Let's meet the Ultimate Business Owner",
      description:
        "Provide the profile of the person who ultimately owns or controls the business.",
    },
 
  ],
  ubo2: [
    {
      name: "Ultimate Business Owner 2",
      route: "UboDetails2",
      title: "Let's meet the Ultimate Business Owner",
      description:
        "Provide the profile of the second person who ultimately owns or controls the business.",
    },
 
  ],

};

export const merchantOnboardingRouteList = [
  {
    name: "Business Profile",
    route: "MerchantBusinessProfile",
    category: "business",
    metadata: onboardingRouteMap.business,
  },
  {
    name: "Business Address",
    route: "MerchantBusinessAddress",
    category: "address",
    metadata: onboardingRouteMap.address,
  },
  {
    name: "Director's Details",
    route: "DirectorDetails1",
    category: "director1",
    metadata: onboardingRouteMap.director1,
  },
  {
    name: "Director's Details 2",
    route: "DirectorDetails2",
    category: "director2",
    metadata: onboardingRouteMap.director2,
  },

  {
    name: "Ultimate Business Owner",
    route: "UboDetails1",
    category: "ubo1",
    metadata: onboardingRouteMap.ubo1,
  },

  {
    name: "Ultimate Business Owner 2",
    route: "UboDetails2",
    category: "ubo2",
    metadata: onboardingRouteMap.ubo2,
  },

  {
    name: "Business Documents",
    route: "BusinessDocuments",
    category: "registration",
    metadata: onboardingRouteMap.registration,
  },
];
