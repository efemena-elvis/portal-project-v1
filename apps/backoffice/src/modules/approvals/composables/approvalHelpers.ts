import { useDate, useString } from "@packages/hooks";

const { formatNumber, capitalizeFirstLetter } = useString();

export const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

export const mapStatusKey = (status: string) => {
  const value = (status || "").toLowerCase();
  if (value === "completed" || value === "successful") return "successful";
  if (value === "failed" || value === "rejected") return "failed";
  if (value === "cancelled") return "no-status";
  return "pending";
};

export const normalizeApprovalRequest = (data: any) => {
  return {
    id: data?.uuid,
    amount: data?.amount ? formatNumber(Number(data?.amount)) : "-",
    currency: data?.currency,
    status: capitalizeFirstLetter(
      (data?.status || "-").toString().toLowerCase(),
    ),
    date: data?.created_at ? getDateCreated(data?.created_at) : "-",
    merchantName: data?.account_name || "-",
    merchantId: data?.transaction_id || "",
    reference: data?.reference,
    accountNumber: data?.account_number || "",
    bankName: data?.bank_name || "",
    accountName: data?.account_name || "",
    failureReason: data?.failure_reason || "-",
    isFunding: true,
  };
};

export const normalizeWithdrawalRequest = (data: any) => {
  return {
    uuid: data?.uuid,
    id: data?.reference || "",
    amount: data?.amount ? formatNumber(data.amount) : "-",
    currency: data?.currency || "",
    status: capitalizeFirstLetter(
      (data?.status || "-").toString().toLowerCase(),
    ),
    date: data?.created_at ? getDateCreated(data.created_at) : "-",
    merchantName: data?.account_name || "-",
    merchantId: "",
    reference: data?.reference || "-",
    accountNumber: data?.account_number || "",
    narration: data?.narration || "",
    failureReason: data?.failure_reason || "-",
    isFunding: false,
  };
};
