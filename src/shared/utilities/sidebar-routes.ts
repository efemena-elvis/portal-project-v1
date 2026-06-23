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
    {
      slug: "compliance",
      link: "/compliance",
      title: "Compliance",
      icon: "icon-shield-tick",
      active: true,
      category: "home",
    },
    {
      slug: "transactions",
      link: "/admin-transactions",
      title: "Transactions",
      icon: "icon-card-transaction",
      active: true,
      category: "home",
    },
    {
      slug: "merchants",
      link: "/merchants",
      title: "Merchants",
      icon: "icon-shop",
      active: true,
      category: "home",
    },
    // {
    //   slug: "aggregators",
    //   link: "/aggregators",
    //   title: "Aggregators",
    //   icon: "icon-building",
    //   active: true,
    //   category: "home",
    // },
    // {
    //   slug: "disputes",
    //   link: "/disputes",
    //   title: "Disputes",
    //   icon: "icon-forbidden",
    //   active: true,
    //   category: "home",
    // },
    {
      slug: "withdrawal-requests",
      link: "/withdrawal-requests",
      title: "Withdrawal Requests",
      icon: "icon-export",
      active: true,
      category: "home",
    },
    {
      slug: "fundings",
      link: "/fundings",
      title: "Fundings",
      icon: "icon-money-3",
      active: true,
      category: "home",
    },
    {
      slug: "fees",
      link: "/fees",
      title: "Fees",
      icon: "icon-receive",
      active: true,
      category: "home",
    },
    {
      slug: "manage-teams",
      link: "/manage-teams",
      title: "Manage Teams",
      icon: "icon-profile-users",
      active: true,
      category: "home",
    },
  ],

  subLevel: [],

  bottomLevel: [
    {
      link: "/logout",
      title: "Sign Out",
      icon: "icon-logout",
      active: true,
      category: "auth",
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
    routeTitle: "Developer",
    routeLinkName: "VesicashDeveloper",
  },
];
