import { ISidebarRouteType, ISideNavType } from "@packages/models";

export const sidebarRoutes: ISidebarRouteType = {
  topLevel: [
    {
      slug: "overview",
      link: "/overview",
      title: "Overview",
      icon: "icon-four-square",
      active: true,
      category: "home",
    },
  ],

  subLevel: [
    {
      link: "/products",
      title: "Products",
      icon: "icon-shop",
      active: true,
      category: "storefront",
    },
    {
      link: "/orders",
      title: "Orders",
      icon: "icon-truck-fast",
      active: true,
      category: "storefront",
    },
    {
      link: "/customers",
      title: "Customers",
      icon: "icon-profile-users",
      active: true,
      category: "storefront",
    },

    {
      link: "/transactions",
      title: "Transactions",
      icon: "icon-card-transaction",
      active: true,
      category: "payments",
    },

    // {
    //   link: "/balance-history",
    //   title: "Balance history",
    //   icon: "icon-empty-wallet",
    //   active: true,
    //   category: "payments",
    // },
    {
      link: "/payouts",
      title: "Payouts",
      icon: "icon-export",
      active: true,
      category: "payments",
    },
  ],

  bottomLevel: [
    // {
    //   link: "/settings/developer",
    //   title: "Developer",
    //   icon: "icon-developer",
    //   active: true,
    //   category: "settings",
    // },
    {
      link: "/settings/profile",
      title: "Settings",
      icon: "icon-cog",
      active: true,
      category: "settings",
    },
    {
      link: "/logout",
      title: "Logout",
      icon: "icon-logout",
      active: true,
      category: "logout",
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
  {
    routeTitle: "Domains",
    routeLinkName: "VesicashDomains",
  },
  {
    routeTitle: "Developers",
    routeLinkName: "VesicashDevelopers",
  },
];
