<template>
  <main class="compliance-details">
    <button class="back-button" type="button" @click="goBack">
      <span class="icon icon-arrow-left"></span>
      Back to all compliance
    </button>

    <section v-if="isLoading" class="state-card">
      Loading compliance details...
    </section>

    <section v-else-if="!merchant" class="state-card">
      <h1>Compliance record not found</h1>
      <p>This merchant may no longer have a compliance record.</p>
      <button class="back-button" type="button" @click="goBack">
        Back to all compliance
      </button>
    </section>

    <template v-else>
      <section class="details-grid">
        <div class="details-main">
          <section class="summary-card">
            <div class="business-mark">
              <span>{{ businessInitials }}</span>
            </div>
            <div class="summary-copy">
              <p class="field-label">Business name</p>
              <div class="summary-title-row">
                <h1>{{ business.name || "—" }}</h1>
                <span class="chip chip-warning">Merchant</span>
                <span class="chip chip-info">{{ countryName }}</span>
              </div>
            </div>
          </section>

          <section class="detail-card">
            <div class="form-grid">
              <ReadOnlyField label="Trading name" :value="tradingName" />
              <ReadOnlyField label="Business sector" :value="businessSector" />
              <ReadOnlyField label="Phone number" :value="phoneNumber" />
            </div>
          </section>

          <section class="detail-card documents-card">
            <h2>Business registration documents</h2>
            <DocumentRow
              v-for="doc in documents"
              :key="doc.id"
              :label="doc.label"
              :filename="doc.value"
              :url="doc.url"
              :displayType="doc.displayType"
              :documentUuid="doc.id"
              :hasDocument="doc.hasDocument"
              :reviewStatus="doc.reviewStatus"
              :isProcessing="isProcessing && activeDocument?.uuid === doc.id"
              @view="handleDocumentView"
              @approve="(document) => openActionModal('approve', document)"
              @reject="(document) => openActionModal('reject', document)"
            />
            <p v-if="!documents.length" class="empty-documents">
              No business registration documents were submitted.
            </p>
          </section>
        </div>

        <aside class="details-side">
          <section class="side-card address-card">
            <h2>Address</h2>
            <ReadOnlyField
              v-for="field in addressFields"
              :key="field.label"
              :label="field.label"
              :value="field.value"
            />
          </section>
        </aside>
      </section>
    </template>

    <ComplianceActionModal
      v-if="activeDocument"
      :action="activeAction"
      :section="activeDocument.label"
      :isProcessing="isProcessing"
      @closeTriggered="closeActionModal"
      @confirmed="handleActionConfirmed"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { countryCurrencies } from "@packages/constants";
import { useEvents } from "@packages/hooks";
import { ReadOnlyField, DocumentRow } from "@/modules/compliance/components";
import { ComplianceActionModal } from "@/modules/compliance/modals";
import { useComplianceStore } from "@/modules/compliance/store";
import type {
  ComplianceBusiness,
  ComplianceDocument,
  ComplianceMerchant,
} from "../types";

type DocumentDisplay = {
  id: string;
  label: string;
  value: string;
  url: string;
  displayType: "file" | "text";
  hasDocument: boolean;
  reviewStatus: "pending" | "approved" | "rejected";
};

type DocumentAction = "approve" | "reject";

type ActiveDocument = {
  uuid: string;
  label: string;
};

const route = useRoute();
const router = useRouter();
const { processAPIRequest } = useEvents();
const {
  getComplianceDetails,
  approveComplianceDocument,
  rejectComplianceDocument,
} = useComplianceStore();

const isLoading = ref(true);
const merchant = ref<ComplianceMerchant | null>(null);
const activeDocument = ref<ActiveDocument | null>(null);
const activeAction = ref<DocumentAction>("approve");
const isProcessing = ref(false);
const rejectedDocuments = ref<Record<string, true>>({});

const emptyBusiness: ComplianceBusiness = {
  uuid: "",
  name: "",
  country_id: 0,
  country_code: "",
  trading_name: "",
  operation: "",
  category: "",
  phone_number: "",
  website: "",
  address: "",
  city: "",
  state: "",
  tax_ref: "",
  status: "",
  kyc_completed: false,
};
const business = computed(() => merchant.value?.business || emptyBusiness);
const countryData = computed(() =>
  countryCurrencies.find(
    (country) =>
      country.code.toLowerCase() ===
      (business.value?.country_code || "").toLowerCase(),
  ),
);
const countryName = computed(() => countryData.value?.country || "—");
const tradingName = computed(() => business.value?.trading_name || "—");
const businessSector = computed(() => humanize(business.value?.category));
const phoneNumber = computed(() => business.value?.phone_number || "-");
const businessInitials = computed(
  () =>
    (business.value?.name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "—",
);
const documents = computed<DocumentDisplay[]>(() =>
  (merchant.value?.documents || []).map((document) => ({
    id: document.uuid,
    label: document.document_name || "Document",
    value: getDocumentValue(document),
    url: document.file_url || "",
    displayType: document.document_type === "text" ? "text" : "file",
    hasDocument: hasDocumentContent(document),
    reviewStatus: document.is_verified
      ? "approved"
      : rejectedDocuments.value[document.uuid]
        ? "rejected"
        : "pending",
  })),
);
const addressFields = computed(() => [
  { label: "Business address", value: business.value?.address || "—" },
  { label: "City", value: business.value?.city || "—" },
  { label: "State/Province", value: business.value?.state || "—" },
  { label: "Website URL", value: business.value?.website || "—" },
]);

function humanize(value?: string) {
  if (!value) return "—";
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getDocumentValue(document: ComplianceDocument) {
  if (document.document_type === "text")
    return document.value || "No value provided";
  if (document.file_name) return document.file_name;
  return document.file_url.split("/").pop() || "No file provided";
}

function hasDocumentContent(document: ComplianceDocument) {
  if (document.document_type === "file") return !!document.file_url.trim();

  const value = document.value.trim();
  return !!value && value.toLowerCase() !== "migrated";
}

const goBack = () => router.push({ name: "VesicashCompliance" });

const fetchComplianceDetails = async () => {
  isLoading.value = true;
  merchant.value = null;
  const response = await processAPIRequest({
    action: getComplianceDetails,
    payload: route.params.id as string,
    showAlert: false,
  });
  if (response?.code === 200)
    merchant.value = response.data?.merchants?.[0] || null;
  isLoading.value = false;
};

const handleDocumentView = (payload: { url: string }) => {
  if (payload.url) window.open(payload.url, "_blank", "noopener,noreferrer");
};

const openActionModal = (
  action: DocumentAction,
  {
    documentUuid,
    label,
  }: {
    documentUuid: string;
    label: string;
  },
) => {
  if (!isProcessing.value) {
    activeAction.value = action;
    activeDocument.value = { uuid: documentUuid, label };
  }
};

const closeActionModal = () => {
  if (!isProcessing.value) activeDocument.value = null;
};

const handleActionConfirmed = async () => {
  const document = activeDocument.value;
  if (!document || isProcessing.value) return;

  isProcessing.value = true;
  const isApproval = activeAction.value === "approve";
  const actionLabel = isApproval ? "approved" : "rejected";
  const response = await processAPIRequest({
    action: isApproval ? approveComplianceDocument : rejectComplianceDocument,
    payload: document.uuid,
    alertHandler: {
      200: {
        type: "success",
        message: `Document ${actionLabel}`,
        description: `${document.label} has been ${actionLabel}.`,
      },
      201: {
        type: "success",
        message: `Document ${actionLabel}`,
        description: `${document.label} has been ${actionLabel}.`,
      },
      400: {
        type: "error",
        message: `Unable to ${activeAction.value} document`,
      },
      404: {
        type: "error",
        message: "Document not found",
        description: "Please refresh the page and try again.",
      },
      500: {
        type: "error",
        message: `Unable to ${activeAction.value} document`,
      },
    },
  });

  if ((response?.code === 200 || response?.code === 201) && merchant.value) {
    if (isApproval) {
      merchant.value = {
        ...merchant.value,
        documents: merchant.value.documents.map((item) =>
          item.uuid === document.uuid ? { ...item, is_verified: true } : item,
        ),
      };
    } else {
      rejectedDocuments.value = {
        ...rejectedDocuments.value,
        [document.uuid]: true,
      };
    }
    activeDocument.value = null;
  }

  isProcessing.value = false;
};

watch(() => route.params.id, fetchComplianceDetails, { immediate: true });
</script>

<style scoped lang="scss">
.compliance-details {
  @apply w-full min-h-screen pt-8 pb-10 text-grey-900;
}
.back-button {
  @apply inline-flex items-center gap-2 rounded-lg border border-grey-700 bg-white px-4 py-3 text-sm font-semibold text-grey-900 transition hover:border-teal-800 hover:text-teal-800;
}
.state-card {
  @apply mt-7 flex min-h-48 flex-col items-start justify-center gap-4 rounded-lg bg-white p-8 text-grey-700;
  h1 {
    @apply text-xl font-bold text-teal-800;
  }
}
.details-grid {
  @apply mt-7 grid grid-cols-[minmax(0,1fr)_600px] gap-8 xl:grid-cols-[minmax(0,1fr)_500px] lg:grid-cols-1;
}
.details-main,
.details-side {
  @apply flex flex-col gap-7;
}
.summary-card,
.detail-card,
.side-card {
  @apply rounded-lg bg-white;
}
.summary-card {
  @apply flex items-center gap-6 p-8 sm:flex-col sm:items-start sm:p-5;
}
.business-mark {
  @apply flex size-14 shrink-0 items-center justify-center rounded-full border border-grey-100 bg-teal-50 text-base font-bold text-teal-800;
}
.summary-copy {
  @apply flex flex-col gap-2;
}
.field-label {
  @apply text-sm font-medium text-grey-600;
}
.summary-title-row {
  @apply flex flex-wrap items-center gap-4;
  h1 {
    @apply text-2xl font-bold text-teal-800 sm:text-xl;
  }
}
.chip {
  @apply rounded-full px-5 py-2 text-sm font-semibold;
}
.chip-warning {
  @apply bg-yellow-50 text-yellow-700;
}
.chip-info {
  @apply bg-blue-50 text-blue-600;
}
.detail-card {
  @apply p-7 sm:p-5;
  h2 {
    @apply mb-7 text-base font-bold text-grey-900;
  }
}
.form-grid {
  @apply grid grid-cols-2 gap-x-7 gap-y-6 md:grid-cols-1;
}

.documents-card {
  @apply pb-6;
}
.empty-documents {
  @apply text-sm font-medium text-grey-600;
}
.side-card {
  @apply p-6;
  h2 {
    @apply mb-7 text-base font-bold text-grey-900;
  }
}
.address-card {
  @apply flex flex-col gap-5;
  h2 {
    @apply mb-2;
  }
}
</style>
