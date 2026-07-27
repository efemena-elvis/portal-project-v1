<template>
  <main class="compliance-details">
    <button class="back-button" type="button" @click="goBack">
      <span class="icon icon-arrow-left"></span>
      Back to all compliance
    </button>

    <section class="details-grid">
      <div class="details-main">
        <section class="summary-card">
          <div class="business-mark">
            <span>{{ businessInitials }}</span>
          </div>

          <div class="summary-copy">
            <p class="field-label">Business name</p>
            <div class="summary-title-row">
              <h1>{{ complianceDetails.businessName }}</h1>
              <span class="chip chip-warning">{{
                complianceDetails.type
              }}</span>
              <span class="chip chip-info">{{
                complianceDetails.country
              }}</span>
            </div>
            <p class="aggregator">
              Merchant: <strong>{{ complianceDetails.aggregator }}</strong>
            </p>
          </div>
        </section>

        <section class="detail-card">
          <div class="form-grid">
            <ReadOnlyField
              label="Trading name"
              :value="businessProfile.tradingName"
            />
            <ReadOnlyField
              label="Business sector"
              :value="businessProfile.sector"
            />
            <ReadOnlyField label="Phone number" :value="businessProfile.phone">
              <template #prefix>
                <span class="phone-prefix">
                  <img
                    v-if="countryFlag"
                    :src="countryFlag"
                    class="flag-icon"
                    alt=""
                  />
                  <span class="dial-code">+{{ dialCode }}</span>
                </span>
              </template>
            </ReadOnlyField>
          </div>
          <ReviewActions
            section="Business Information"
            @approve="(section: string) => openActionModal('approve', section)"
            @reject="(section: string) => openActionModal('reject', section)"
          />
        </section>

        <section class="detail-card documents-card">
          <h2>Business registration documents</h2>
          <DocumentRow
            v-for="doc in documents"
            :key="doc.label"
            :label="doc.label"
            :filename="doc.filename"
            @view="handleDocumentView"
          />

          <div class="upload-area">
            <FileUploadInput
              :hasDocumentUploaded="!!uploadedDocUrl"
              :uploadAction="uploadCompliance"
              @onDocumentUploaded="uploadedDocUrl = $event"
            />
          </div>

          <ReviewActions
            section="Business Registration Documents"
            @approve="(section: string) => openActionModal('approve', section)"
            @reject="(section: string) => openActionModal('reject', section)"
          />
        </section>

        <section class="detail-card">
          <h2>Representative</h2>
          <div class="form-grid">
            <ReadOnlyField
              v-for="field in representativeFields"
              :key="field.label"
              :label="field.label"
              :value="field.value"
            />
          </div>
          <DocumentRow
            label="Identity"
            :filename="identityDoc"
            compact
            @view="handleDocumentView"
          />
          <div class="upload-area">
            <FileUploadInput
              :hasDocumentUploaded="!!uploadedDocUrl"
              :uploadAction="uploadCompliance"
              @onDocumentUploaded="uploadedDocUrl = $event"
            />
          </div>
          <ReviewActions
            section="Representative Information"
            @approve="(section: string) => openActionModal('approve', section)"
            @reject="(section: string) => openActionModal('reject', section)"
          />
        </section>
      </div>

      <aside class="details-side">
        <section class="side-card progress-card">
          <div class="completion-ring" :style="ringStyle">
            <div class="completion-inner">
              <span>Completed</span>
              <strong>{{ completion }}%</strong>
            </div>
          </div>

          <div class="progress-list">
            <ProgressRow
              v-for="row in progressRows"
              :key="row.label"
              :label="row.label"
              :value="row.value"
              :complete="row.complete"
            />
          </div>
        </section>

        <section class="side-card address-card">
          <h2>Address</h2>
          <ReadOnlyField
            v-for="field in addressFields"
            :key="field.label"
            :label="field.label"
            :value="field.value"
          />
          <ReviewActions
            section="Address Information"
            @approve="(section: string) => openActionModal('approve', section)"
            @reject="(section: string) => openActionModal('reject', section)"
          />
        </section>
      </aside>
    </section>

    <ComplianceActionModal
      v-if="showActionModal"
      :action="activeAction"
      :section="activeSection"
      @closeTriggered="closeActionModal"
      @confirmed="handleActionConfirmed"
    />

    <section class="completion-card">
      <h2>Compliance check complete</h2>

      <label class="select-field">
        <span>Verdict</span>
        <div class="select-wrapper">
          <select v-model="verdict">
            <option value="Pass">Pass</option>
            <option value="Needs review">Needs review</option>
            <option value="Fail">Fail</option>
          </select>
          <span class="icon icon-caret-down select-icon" />
        </div>
      </label>

      <label class="select-field">
        <span>Reason</span>
        <div class="select-wrapper">
          <select v-model="reason">
            <option value="This compliance meets all requirement">
              This compliance meets all requirement
            </option>
            <option value="Documents need further review">
              Documents need further review
            </option>
            <option value="Required details are incomplete">
              Required details are incomplete
            </option>
          </select>
          <span class="icon icon-caret-down select-icon" />
        </div>
      </label>

      <button class="send-button" type="button">Send</button>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { countryCurrencies } from "@packages/constants";
import { FileUploadInput } from "@packages/uikit";
import {
  ReadOnlyField,
  DocumentRow,
  ReviewActions,
  ProgressRow,
} from "@/modules/compliance/components";
import { ComplianceActionModal } from "@/modules/compliance/modals";
import { useComplianceStore } from "@/modules/compliance/store";

const { uploadCompliance } = useComplianceStore();

const route = useRoute();
const router = useRouter();

const completion = 25;
const verdict = ref("Pass");
const reason = ref("This compliance meets all requirement");
const uploadedDocUrl = ref("");

const routeValue = (key: string, fallback: string) => {
  const value = route.query[key];
  return typeof value === "string" && value.trim() ? value : fallback;
};

const complianceDetails = computed(() => ({
  businessName: routeValue("business", "Tech-village Inc"),
  type: routeValue("type", "Merchant"),
  country: routeValue("country", "Ghana"),
  aggregator: routeValue("aggregator", "Olamide Pro Inc"),
}));

const countryData = computed(() =>
  countryCurrencies.find(
    (countryCurrency) =>
      countryCurrency.country.toLowerCase() ===
      complianceDetails.value.country.toLowerCase(),
  ),
);

const countryFlag = computed(() => countryData.value?.flag || "");

const dialCode = computed(() => countryData.value?.dialing_code || "");

const businessInitials = computed(() =>
  complianceDetails.value.businessName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase(),
);

const goBack = () => {
  router.push({ name: "VesicashCompliance" });
};

const businessProfile = {
  tradingName: "Tech-village Ghana",
  sector: "Buying and Selling",
  phone: "078025857771",
};

const documents = [
  { label: "Business certificate", filename: "Business registration doc.pdf" },
  { label: "Form 3", filename: "Business form 3 .pdf" },
  { label: "TAX", filename: "Tax identification doc .pdf" },
];

const representativeFields = [
  { label: "Full name", value: "Jordan Ayew" },
  { label: "DOB", value: "11/6/1999" },
  { label: "Nationality", value: "Ghana" },
  { label: "Business role", value: "Advisor" },
];

const identityDoc = "National ID card .pdf";

const addressFields = [
  { label: "Business address", value: "28 boundary road" },
  { label: "City", value: "Kinshasa" },
  { label: "State/Province", value: "Kinshasa" },
  { label: "Business sector", value: "Buying and Selling" },
  { label: "Website URL", value: "www.techvi.com" },
];

const progressRows = [
  { label: "Business", value: 100, complete: true },
  { label: "Registration", value: 40, complete: false },
  { label: "Representative", value: 72, complete: false },
];

const ringStyle = computed(() => ({
  background: `conic-gradient(#2faee9 0 ${completion}%, #f4faf8 ${completion}% 100%)`,
}));

const showActionModal = ref(false);
const activeAction = ref("");
const activeSection = ref("");

const openActionModal = (action: string, section: string) => {
  activeAction.value = action;
  activeSection.value = section;
  showActionModal.value = true;
};

const closeActionModal = () => {
  showActionModal.value = false;
};

const handleActionConfirmed = (payload: {
  action: string;
  section: string;
}) => {
  showActionModal.value = false;
};

const handleDocumentView = (payload: { label: string; filename: string }) => {
  // ready for integration with a document viewer
};
</script>

<style scoped lang="scss">
.compliance-details {
  @apply w-full min-h-screen pt-8 pb-10 text-grey-900;
}

.back-button {
  @apply inline-flex items-center gap-2 rounded-lg border border-grey-700 bg-white px-4 py-3 text-sm font-semibold text-grey-900 transition hover:border-teal-800 hover:text-teal-800;
}

.details-grid {
  @apply mt-7 grid grid-cols-[minmax(0,1fr)_350px] gap-8 xl:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-1;
}

.details-main {
  @apply flex flex-col gap-7;
}

.details-side {
  @apply flex flex-col gap-7;
}

.summary-card,
.detail-card,
.side-card,
.completion-card {
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

.aggregator {
  @apply text-sm text-grey-700;

  strong {
    @apply ml-1 font-bold text-teal-800;
  }
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

.phone-prefix {
  @apply flex h-full items-center gap-2 border-r border-grey-200 px-4 text-sm font-medium text-grey-700;
}

.flag-icon {
  @apply size-5 rounded-full object-cover;
}

.documents-card {
  @apply pb-6;
}

.upload-area {
  @apply mt-6;
}

.side-card {
  @apply p-6;

  h2 {
    @apply mb-7 text-base font-bold text-grey-900;
  }
}

.progress-card {
  @apply flex min-h-[395px] flex-col items-center justify-center gap-8;
}

.completion-ring {
  @apply flex size-[220px] items-center justify-center rounded-full;
}

.completion-inner {
  @apply flex size-[170px] flex-col items-center justify-center rounded-full bg-white text-center;

  span {
    @apply text-sm font-medium text-grey-600;
  }

  strong {
    @apply mt-2 text-2xl font-bold text-grey-900;
  }
}

.progress-list {
  @apply flex w-full flex-col gap-4;
}

.address-card {
  @apply flex flex-col gap-5;

  h2 {
    @apply mb-2;
  }
}

.completion-card {
  @apply mt-8 p-7 sm:p-5 w-[77%];

  h2 {
    @apply mb-8 text-2xl font-bold text-teal-800 sm:text-xl;
  }
}

.select-field {
  @apply mb-6 flex flex-col gap-2 text-sm font-bold text-grey-900;
}

.select-wrapper {
  @apply relative;

  select {
    @apply h-12 w-full rounded-lg border border-grey-300 appearance-none bg-white px-4 pr-10 text-sm font-medium text-grey-800 outline-none transition focus:border-green-500;
  }
}

.select-icon {
  @apply absolute right-4 top-1/2 -translate-y-1/2 text-grey-700 pointer-events-none text-sm;
}

.send-button {
  @apply mt-4 h-11 w-[185px] rounded-lg bg-green-500 text-sm font-bold text-white transition hover:bg-green-600 sm:w-full;
}
</style>
