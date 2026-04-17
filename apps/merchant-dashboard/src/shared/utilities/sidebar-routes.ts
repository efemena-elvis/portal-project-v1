import { ISidebarRouteType, ISideNavType } from "@packages/models";

export const sidebarRoutes: ISidebarRouteType = {
  topLevel: [
    {
      slug: "overview",
      link: "/overview",
      title: "Overview",
      icon: "icon-home",
      active: true,
      category: "home",
    },
  ],

  subLevel: [
    // {
    //   link: "/overview",
    //   title: "Overview",
    //   icon: "icon-home",
    //   active: true,
    //   category: "home",
    // },

    {
      link: "/transactions",
      title: "Transactions",
      icon: "icon-card-transaction",
      active: true,
      category: "payments",
    },
    {
      link: "/customers",
      title: "Customers",
      icon: "icon-profile-users",
      active: true,
      category: "payments",
      type: "merchant",
    },
    {
      link: "/refunds",
      title: "Refunds",
      icon: "icon-send",
      active: true,
      category: "payments",
    },
    {
      link: "/payment-links",
      title: "Payment Links",
      icon: "icon-link",
      active: true,
      category: "payments",
    },
    {
      link: "/balance-history",
      title: "Balance history",
      icon: "icon-empty-wallet",
      active: true,
      category: "balances",
    },
    {
      link: "/payouts",
      title: "Payouts",
      icon: "icon-export",
      active: true,
      category: "balances",
    },
    {
      link: "/storefront",
      title: "Storefront",
      icon: "icon-shopping-cart",
      active: true,
      category: "commerce",
    },
  ],

  bottomLevel: [
    {
      link: "/settings/developer",
      title: "Developer",
      icon: "icon-developer",
      active: true,
      category: "settings",
    },
    {
      link: "/settings/profile",
      title: "Settings",
      icon: "icon-cog",
      active: true,
      category: "settings",
    },
  ],
};

export const settingsSidebarRoutes: ISideNavType[] = [
  {
    routeTitle: "My Profile",
    routeLinkName: "VesicashProfile",
  },
  {
    routeTitle: "Bank Account",
    routeLinkName: "VesicashBankAccount",
  },
  // {
  //   routeTitle: "Teams",
  //   routeLinkName: "RedstoneAccountSettings",
  // },
  {
    routeTitle: "Developer",
    routeLinkName: "VesicashDeveloper",
  },
  {
    routeTitle: "Publishable Keys",
    routeLinkName: "VesicashPublishableKeys",
  },
];
