import { ref } from "vue";

export const teamList = ref<any[]>([
  {
    id: 1,
    name: "Ahmed Tijjani",
    status: "Active",
    email: "olamitijanini54@gmail.com",
    lastActive: "16 Mar. 2025, 7:22pm",
    countries: ["Tanzania", "Nigeria", "Zambia"],
    role: "admin",
  },
  {
    id: 2,
    name: "Ifedolapo Bankole",
    status: "Offline",
    email: "mitijanini54@gmail.com",
    lastActive: "16 Mar. 2025, 7:22pm",
    countries: ["Nigeria"],
    role: "admin",
  },
  {
    id: 3,
    name: "Piriye Amiesimaka",
    status: "Offline",
    email: "mitijanini54@gmail.com",
    lastActive: "16 Mar. 2025, 7:22pm",
    countries: ["Tanzania", "Ghana"],
    role: "operations",
  },
  {
    id: 4,
    name: "Adeola Omisore",
    status: "Active",
    email: "olamitijanin@gmail.com",
    lastActive: "16 Mar. 2025, 7:22pm",
    countries: ["Tanzania"],
    role: "operations",
  },
  {
    id: 5,
    name: "Ngoebi Tuma",
    status: "Active",
    email: "olamitnini54@gmail.com",
    lastActive: "16 Mar. 2025, 7:22pm",
    countries: ["Tanzania", "Nigeria"],
    role: "admin",
  },
]);
export const teamDetail = ref<Record<string, any> | null>(null);

const adminPermissions = {
  Transactions: [
    "View Business Performance Metrics",
    "View Transactions",
    "Export Transactions",
    "Manage Refunds & Disputes",
    "Manage & Update Customers",
    "View Customers",
    "Create New Customers",
    "View Customer Insights",
    "View payouts",
    "View export payouts",
    "View view transfers",
    "View balance history",
    "Export balance history",
    "Create and Manage Payment Pages",
    "View Payment Pages",
    "Create and Manage Product Pages",
    "View Product Pages",
    "Create and Manage Invoices",
    "View Invoices",
    "Create and Manage Subaccounts & Splits",
  ],

  Support: [
    "View export payouts",
    "View view transfers",
    "View balance history",
    "Export balance history",
    "Create and Manage Payment Pages",
    "View Payment Pages",
    "Create and Manage Product Pages",
    "View Product Pages",
    "Create and Manage Invoices",
    "View Invoices",
    "Create and Manage Subaccounts & Splits",
    "View Subaccounts & Splits",
    "Create and Manage Plans & Subscriptions",
    "View Plans & Subscriptions",
    "View Business Settings & Preferences",
    "Invite Users",
  ],

  Compliance: [
    "View Transactions",
    "Manage Refunds & Disputes",
    "View Customers",
  ],
  Payments: [
    "View Transactions",
    "Export Transactions",
    "Manage & Update Customers",
    "View Customers",
    "Create New Customers",
    "Create and Manage Payment Pages",
    "View Payment Pages",
    "View Product Pages",
    "Create and Manage invoices",
    "View Invoices",
    "Create and Manage Subaccounts & Splits",
    "View Subaccounts & Splits",
    "View Business Settings & Preferences",
    "Manage API Keys & Webhooks",
    "View API Keys & Webhooks",
  ],
  Operations: [
    "View Transactions",
    "Manage Refunds & Disputes",
    "View Customers",
  ],
};

export const defaultRoles = ref<any[]>([
  {
    id: "admin",
    name: "Admin",
    description: "For people with high level priority",
    permissions: adminPermissions,
  },
  {
    id: "operations",
    name: "Operations",
    description: "For people who are in charge of operations",
    permissions: adminPermissions,
  },
]);

export const customRoles = ref<any[]>([
  {
    id: "custom-1",
    name: "Admin but edited",
    description: "custom roles for Nigerian employees",
  },
  {
    id: "custom-2",
    name: "Operations",
    description: "For people in charge of operations",
  },
]);
