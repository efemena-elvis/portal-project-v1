import { IRouteType } from "@packages/models";
import { FullPageLayout } from "@packages/uikit";

// *********** VESICASH COMPLIANCE ROUTES *********** //
const overviewRoutes: IRouteType[] = [
  {
    path: "/compliance",
    component: () => Promise.resolve(FullPageLayout),
    children: [
      // *********** BUSINESS PROFILE COMPLIANCE *********** //
      {
        path: "business-profile",
        name: "ComplianceBusinessProfile",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/business/business-profile.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Business-Profile",
            description: "Vesicash MoR business profile compliance",
          },
        },
      },

      // *********** BUSINESS CONTACT COMPLIANCE *********** //
      {
        path: "business-contact",
        name: "ComplianceBusinessContact",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/business/business-contact.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Business-Contact",
            description: "Vesicash MoR business contact compliance",
          },
        },
      },

      // *********** BUSINESS ADDRESS COMPLIANCE *********** //
      {
        path: "business-address",
        name: "ComplianceBusinessAddress",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/business/business-address.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Business-Address",
            description: "Vesicash MoR business address compliance",
          },
        },
      },

      // *********** BUSINESS VERIFICATION COMPLIANCE *********** //
      {
        path: "business-verification",
        name: "ComplianceBusinessVerification",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/business/business-verification.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Business-Verify",
            description: "Vesicash MoR business verification compliance",
          },
        },
      },

      // *********** REGISTRATION DOCUMENTS COMPLIANCE *********** //
      {
        path: "registration-documents",
        name: "ComplianceRegistrationDocuments",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/registration/registration-documents.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Registration-Documents",
            description: "Vesicash MoR registration documents compliance",
          },
        },
      },

      // *********** REGISTRATION TAX COMPLIANCE *********** //
      {
        path: "registration-tax",
        name: "ComplianceRegistrationTax",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/registration/registration-tax.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Registration-Tax",
            description: "Vesicash MoR registration tax compliance",
          },
        },
      },

      // *********** REPRESENTATIVE COMPLIANCE *********** //
      {
        path: "representative-profile",
        name: "ComplianceRepresentativeProfile",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/representative/representative-profile.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Representative-Profile",
            description: "Vesicash MoR representative profile compliance",
          },
        },
      },

      {
        path: "representative-identity",
        name: "ComplianceRepresentativeIdentity",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/representative/representative-identity.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Representative-Identity",
            description: "Vesicash MoR representative identity compliance",
          },
        },
      },

      // *********** BANK ACCOUNT COMPLIANCE *********** //
      {
        path: "bank-account",
        name: "ComplianceBankAccount",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/bank/bank-account.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Bank-Account",
            description: "Vesicash MoR bank account compliance",
          },
        },
      },

      // *********** MERCHANT TERMS COMPLIANCE *********** //
      {
        path: "terms",
        name: "ComplianceTerms",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/agreement/terms.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Terms-Agreement",
            description: "Vesicash MoR terms & agreement compliance",
          },
        },
      },

      // *********** MERCHANT COMPLIANCE SUMMARY *********** //
      {
        path: "summary",
        name: "ComplianceSummary",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/summary/compliance-summary.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Summary-Compliance",
            description: "Vesicash MoR compliance summary",
          },
        },
      },

      {
        path: "submitted/:complianceId",
        name: "ComplianceSubmission",
        component: () =>
          import(
            /* webpackChunkName: "compliance-module" */ "@/modules/compliance/pages/compliance-submitted.vue"
          ),
        meta: {
          requiresAuth: true,
          title: "Compliance",
          pageMeta: {
            title: "Submission-Compliance",
            description:
              "Compliance documents is currently undergoing review process",
          },
        },
      },
    ],
  },
];

export default overviewRoutes;
