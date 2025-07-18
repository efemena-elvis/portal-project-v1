const nameSpace: string = "compliance";
const aggregatorNameSpace: string = "aggregator";

export const complianceRoutes = {
  getCompliance: `${nameSpace}/get`,
  uploadCompliance: `${nameSpace}/upload`,
  activateBusiness: `${nameSpace}/activate-business`,
  getDraftedMerchants: `${aggregatorNameSpace}/onboarding/merchants`,
  onboardBulkMerchants: `${aggregatorNameSpace}/onboard-merchant`,
  activateBulkMerchants: `${aggregatorNameSpace}/activate-merchants`,
};
