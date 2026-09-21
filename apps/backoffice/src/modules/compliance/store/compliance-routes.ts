const nameSpace: string = "compliance";

export const complianceRoutes = {
  getCompliance: `admin/${nameSpace}/documents`,
  getComplianceDetails: (merchantId: string) =>
    `admin/${nameSpace}/documents?merchant_id=${encodeURIComponent(merchantId)}&page=1&page_size=20`,
  approveComplianceDocument: (documentUuid: string) =>
    `admin/${nameSpace}/documents/${encodeURIComponent(documentUuid)}/approve`,
  rejectComplianceDocument: (documentUuid: string) =>
    `admin/${nameSpace}/documents/${encodeURIComponent(documentUuid)}/reject`,
  uploadCompliance: `${nameSpace}/upload`,
};
