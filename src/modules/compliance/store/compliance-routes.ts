const nameSpace: string = "compliance";

export const complianceRoutes = {
  getCompliance: `${nameSpace}/get`,
  uploadCompliance: `${nameSpace}/upload`,
  activateBusiness: `${nameSpace}/activate-business`,
  getDraftedMerchants: `${nameSpace}/drafted`,
  onboardBulkMerchants: `${nameSpace}/bulk-onboard`,
  activateBulkMerchants: `${nameSpace}/bulk-activate`,
};
