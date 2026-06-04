const ipageRouteType = (
  name: string,
  route: string,
  title: string,
  description: string,
) => ({ name, route, title, description })

const complianceRouteMap = {
  dashboard: [
    ipageRouteType(
      "Compliance",
      "VesicashCompliance",
      "Compliance",
      "Vesicash portal compliance dashboard",
    ),
  ],
  details: [
    ipageRouteType(
      "Details",
      "ComplianceDetails",
      "Compliance Details",
      "Vesicash portal compliance details",
    ),
  ],
}

export const complianceRouteList = [
  {
    name: "Compliance",
    route: "VesicashCompliance",
    category: "compliance",
    metadata: complianceRouteMap.dashboard,
  },
  {
    name: "Details",
    route: "ComplianceDetails",
    category: "compliance",
    metadata: complianceRouteMap.details,
  },
]

const onboardingRouteMap = {
  entry: [
    ipageRouteType(
      "Entry",
      "MerchantOnboardingEntry",
      "Merchant Onboarding",
      "Begin merchant onboarding process",
    ),
  ],
  document: [
    ipageRouteType(
      "Document",
      "MerchantOnboardingDocument",
      "Business Documents",
      "Upload required business documents",
    ),
  ],
  status: [
    ipageRouteType(
      "Status",
      "MerchantOnboardingStatus",
      "Onboarding Status",
      "Review merchant onboarding status",
    ),
  ],
}

export const merchantOnboardingRouteList = [
  {
    name: "Entry",
    route: "MerchantOnboardingEntry",
    category: "entry",
    metadata: onboardingRouteMap.entry,
  },
  {
    name: "Document",
    route: "MerchantOnboardingDocument",
    category: "document",
    metadata: onboardingRouteMap.document,
  },
  {
    name: "Status",
    route: "MerchantOnboardingStatus",
    category: "status",
    metadata: onboardingRouteMap.status,
  },
]
