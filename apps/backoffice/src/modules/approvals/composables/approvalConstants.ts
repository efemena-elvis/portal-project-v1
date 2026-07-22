export const tabs = [
  { label: "Funding Requests", value: "funding" },
  { label: "Withdrawal Requests", value: "withdrawal" },
] as const;

export const filterConfig = [
  {
    type: "search" as const,
    key: "search",
    placeholder: "Search approval requests",
  },
  {
    type: "select" as const,
    key: "status",
    options: ["Completed", "Pending", "Failed"],
    placeholder: "Status",
  },
  { type: "date" as const, key: "period" },
];

export const fundingStatsTemplate = [
  { title: "Total Funding Requests", value: "-" },
  { title: "Completed", value: "-" },
  { title: "Pending", value: "-" },
  { title: "Failed", value: "-" },
];

export const withdrawalStatsTemplate = [
  { title: "Total Withdrawal Requests", value: "-" },
  { title: "Completed", value: "-" },
  { title: "Pending", value: "-" },
  { title: "Failed", value: "-" },
];
