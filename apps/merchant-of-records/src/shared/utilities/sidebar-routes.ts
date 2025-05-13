import { ISidebarRouteType, ISideNavType } from "@packages/models";


export const getSidebarRoutes = (morAccountType: string): ISidebarRouteType => {
const  subLevel = [
    // {
    //   link: "/overview",
    //   title: "Overview",
    //   icon: "icon-home",
    //   active: true,
    //   category: "home",
    // },
    // {
    //   link: "/compliance/business-profile",
    //   title: "Compliance",
    //   icon: "icon-shield-tick",
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
      link: "/tax-records",
      title: "Tax records",
      icon: "icon-directbox-notif",
      active: true,
      category: "payments",
    },
    {
      link: "/customers",
      title: "Customers",
      icon: "icon-profile-users",
      active: true,
      category: "payments",
    },
    // {
    //   link: "/refunds",
    //   title: "Refunds",
    //   icon: "icon-send",
    //   active: true,
    //   category: "payments",
    // },
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
    }]

  if (morAccountType === "aggregator") {
    subLevel.splice(2,1)
    subLevel.push({
      link: "/merchants",
      title: "Merchants",
      icon: "icon-send",
      active: true,
      category: "payments",
    });
  }

  return {
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
    subLevel,
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
];
