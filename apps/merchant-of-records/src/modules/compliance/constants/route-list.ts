export interface IComplianceSectionType {
  id: string;
  title: string;
  route: string;
  completed: boolean;
}

// COMPLIANCE ROUTE MAP
const complianceRouteMap = {
  business: [
    {
      name: "Profile",
      route: "ComplianceBusinessProfile",
      title: "Tell us more about your business",
      description:
        "As a financial service company, we would need to verify your business registration information",
    },
    {
      name: "Contact",
      route: "ComplianceBusinessContact",
      title: "How can we contact your business?",
      description:
        "Share your business contact channels to ensure smooth communication when needed.",
    },
    {
      name: "Address",
      route: "ComplianceBusinessAddress",
      title: "How can we locate your business?",
      description:
        "Provide your business address details so we can identify your physical location for compliance and verification purposes",
    },
    {
      name: "Verify",
      route: "ComplianceBusinessVerification",
      title: "Verify your business address",
      description:
        "Provide any of the listed relevant document below to help us verify your business address.",
    },
  ],

  registration: [
    {
      name: "Documents",
      route: "ComplianceRegistrationDocuments",
      title: "Business registration documents",
      description:
        "Provide your registered business documents, so Vesicash can verify your business information.",
    },
    {
      name: "Tax",
      route: "ComplianceRegistrationTax",
      title: "Business tax information",
      description:
        "Provide your Tax Payer Identification document below to help us verify your tax registration.",
    },
  ],

  representative: [
    {
      name: "Profile",
      route: "ComplianceRepresentativeProfile",
      title: "Let's meet your business representative",
      description:
        "A business representative could either be an owner, director or shareholder of your business.",
    },
    {
      name: "Identity",
      route: "ComplianceRepresentativeIdentity",
      title: "Business representative identity",
      description:
        "A business representative could either be an owner, director or shareholder of your business.",
    },
  ],

  bank: [
    {
      name: "Bank Account",
      route: "ComplianceBankAccount",
      title: "Business bank details",
      description:
        "Ensure the name on your bank account matches the legal business name you provided.",
    },
  ],

  agreement: [
    {
      name: "Agreement",
      route: "ComplianceTerms",
      title: "Merchant terms & agreement",
      description:
        "Kindly read through and accept the merchant service agreement.",
    },
  ],
  summary: [
    {
      name: "Summary",
      route: "ComplianceSummary",
      title: "Compliance review",
      description:
        "Please ensure the information you submitted are accurate. Incomplete information or documents can delay the activation of your business.",
    },
  ],
};

export const complianceRouteList = [
  {
    name: "Business",
    route: "ComplianceBusinessProfile",
    category: "business",
    metadata: complianceRouteMap.business,
  },
  {
    name: "Registration",
    route: "ComplianceRegistrationDocuments",
    category: "registration",
    metadata: complianceRouteMap.registration,
  },
  {
    name: "Representative",
    route: "ComplianceRepresentativeProfile",
    category: "representative",
    metadata: complianceRouteMap.representative,
  },
  {
    name: "Bank Account",
    route: "ComplianceBankAccount",
    category: "bank",
    metadata: complianceRouteMap.bank,
  },
  {
    name: "Terms & Agreement",
    route: "ComplianceTerms",
    category: "terms",
    metadata: complianceRouteMap.agreement,
  },
  {
    name: "Summary",
    route: "ComplianceSummary",
    category: "summary",
    metadata: complianceRouteMap.summary,
  },
];

export const complianceSections: IComplianceSectionType[] = [
  {
    id: "business_profile",
    title: "Business Profile",
    route: "ComplianceBusinessProfile",
    completed: false,
  },
  {
    id: "business_contact",
    title: "Business Contact",
    route: "ComplianceBusinessContact",
    completed: false,
  },
  {
    id: "business_address",
    title: "Business Address",
    route: "ComplianceBusinessAddress",
    completed: false,
  },
  {
    id: "business_verification",
    title: "Business Verification",
    route: "ComplianceBusinessVerification",
    completed: false,
  },
  {
    id: "registration_document",
    title: "Registration Document",
    route: "ComplianceRegistrationDocuments",
    completed: false,
  },
  {
    id: "registration_tax",
    title: "Registration Tax",
    route: "ComplianceRegistrationTax",
    completed: false,
  },
  {
    id: "representative_profile",
    title: "Representative Profile",
    route: "ComplianceRepresentativeProfile",
    completed: false,
  },
  {
    id: "representative_identity",
    title: "Representative Identity",
    route: "ComplianceRepresentativeIdentity",
    completed: false,
  },
  // {
  //   id: "bank_account",
  //   title: "Bank Account",
  //   route: "ComplianceBankAccount",
  //   completed: false,
  // },
  {
    id: "merchant_agreement",
    title: "Merchant Agreement",
    route: "ComplianceTerms",
    completed: false,
  },
];
