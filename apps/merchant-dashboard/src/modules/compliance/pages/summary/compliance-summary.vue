<template>
  <ComplianceWrapper
    showActionRow
    primaryActionText="Activate my business"
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceTerms' })"
    @onContinueClick="activateMyBusiness"
  >
    <div class="content-block">
      <!-- CONTENT TAB -->
      <div class="content-tab">
        <div
          class="content-tab-item"
          :class="activeTab === 'incomplete' && 'content-tab-item--active'"
          @click="toggleTab('incomplete')"
        >
          Incomplete Sections
        </div>

        <div
          class="content-tab-item"
          :class="activeTab === 'complete' && 'content-tab-item--active'"
          @click="toggleTab('complete')"
        >
          Complete Sections
        </div>
      </div>

      <!-- INCOMPLETE SECTIONS -->
      <div
        class="section-block incomplete-content"
        v-if="activeTab === 'incomplete'"
      >
        <template v-if="incompleteSections.length">
          <SectionTextCard
            :title="section.title"
            :sectionRoute="section.route"
            v-for="(section, index) in incompleteSections"
            :key="index"
          />
        </template>

        <template v-else>
          <EmptyComplianceSection
            title="Compliance sections completed"
            description="Congratulations, you have completed all your compliance sections. Proceed to activate my business"
          />
        </template>
      </div>

      <!-- COMPLETE SECTIONS -->
      <div class="section-block" v-if="activeTab === 'complete'">
        <template v-if="completedSections.length">
          <SectionTextCard
            :title="section.title"
            :sectionRoute="section.route"
            completed
            v-for="(section, index) in completedSections"
            :key="index"
          />
        </template>

        <template v-else>
          <EmptyComplianceSection
            title="No completed sections"
            description="You haven't kick started your compliance journey yet. Navigate to
              business section to get started."
          />
        </template>
      </div>
    </div>
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { EmptyComplianceSection, SectionTextCard } from "@packages/uikit";
import { ComplianceWrapper } from "@/modules/compliance/components";
import {
  IComplianceSectionType,
  complianceSections,
} from "@/modules/compliance/constants/route-list";
import { useComplianceStore } from "@/modules/compliance/store";
import {
  IComplianceBusiness,
  IComplianceRegistration,
  IComplianceRepresentative,
  IComplianceBankAccount,
  IComplianceSignatory,
  IComplianceTerms,
} from "@/modules/compliance/store/compliance-base";

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const complianceStore = useComplianceStore();

const {
  getComplianceId,
  getComplianceBusiness,
  getComplianceRegistration,
  getComplianceRepresentative,
  getComplianceBankAccount,
  getComplianceBusinessSignatory,
  getComplianceAgreement,
} = storeToRefs(complianceStore);

const activeTab = ref<string>("incomplete");
const toggleTab = (selection: string) => (activeTab.value = selection);

const complianceBusiness = ref<IComplianceBusiness>(
  getComplianceBusiness.value as IComplianceBusiness
);
const complianceRegistration = ref<IComplianceRegistration>(
  getComplianceRegistration.value as IComplianceRegistration
);
const complianceRepresentative = ref<IComplianceRepresentative[]>(
  getComplianceRepresentative.value as IComplianceRepresentative[]
);
const complianceBankAccount = ref<IComplianceBankAccount>(
  getComplianceBankAccount.value as IComplianceBankAccount
);
const complianceSignatory = ref<IComplianceSignatory>(
  getComplianceBusinessSignatory.value as IComplianceSignatory
);
const complianceAgreement = ref<IComplianceTerms>(
  getComplianceAgreement.value as IComplianceTerms
);

// Use reactive instead of ref for complianceSectionList
const complianceSectionList = reactive<IComplianceSectionType[]>([
  ...complianceSections,
]);

// Update completed status based on store values
const updateCompletionStatus = () => {
  complianceSectionList.forEach((section) => {
    switch (section.id) {
      case "business_profile":
        section.completed =
          complianceBusiness.value?.legal_name &&
          complianceBusiness.value?.trading_name &&
          complianceBusiness.value?.sector
            ? true
            : false;
        break;

      case "business_contact":
        section.completed =
          complianceBusiness.value?.email &&
          complianceBusiness.value?.phone_number
            ? true
            : false;
        break;

      case "business_address":
        section.completed =
          complianceBusiness.value?.first_address &&
          complianceBusiness.value?.city &&
          complianceBusiness.value?.state
            ? true
            : false;
        break;

      case "business_verification":
        section.completed =
          complianceBusiness.value?.doc_type &&
          complianceBusiness.value?.doc_url
            ? true
            : false;
        break;

      case "registration_document":
        section.completed =
          complianceRegistration.value?.number ||
          complianceRegistration.value?.doc_url
            ? true
            : false;
        break;

      case "registration_tax":
        section.completed =
          complianceRegistration.value?.tax_number ||
          complianceRegistration.value?.tax_doc_url
            ? true
            : false;
        break;

  case "representative_profile":
  section.completed = complianceRepresentative.value?.length
    ? complianceRepresentative.value.every(
        (rep: any) =>
          rep.legal_first_name &&
          rep.legal_last_name &&
          rep.dob &&
          rep.nationality &&
          rep.business_role?.length
      )
    : false;
  break;

case "representative_identity":
  section.completed = complianceRepresentative.value?.length
    ? complianceRepresentative.value.every(
        (rep: any) => rep.doc?.type && rep.doc?.url
      )
    : false;
  break;


      // case "bank_account":
      //   section.completed =
      //     complianceBankAccount.value?.account_number &&
      //     complianceBankAccount.value?.code &&
      //     complianceBankAccount.value?.account_holder_name
      //       ? true
      //       : false;
      //   break;

      case "merchant_agreement":
        section.completed = complianceAgreement.value?.signed_agreement
          ? true
          : false;
        break;
    }
  });
};

const completedSections = computed(() => {
  return complianceSectionList.filter((section) => section.completed);
});

const incompleteSections = computed(() =>
  complianceSectionList.filter((section) => !section.completed)
);

const isActionReady = computed(() =>
  incompleteSections.value.length === 0 ? false : true
);

// Activate my business action
const activateMyBusiness = () => {
  setTimeout(() => {
    router.push({
      name: "ComplianceSubmission",
      params: { complianceId: getComplianceId.value },
    });
  }, 1200);
};

watch(
  [
    getComplianceBusiness,
    getComplianceRegistration,
    getComplianceRepresentative,
    getComplianceBankAccount,
    getComplianceBusinessSignatory,
    getComplianceAgreement,
  ],
  ([
    business,
    registration,
    representative,
    bankAccount,
    signatory,
    agreement,
  ]) => {
    if (business) complianceBusiness.value = business;
    if (registration) complianceRegistration.value = registration;
    if (representative) complianceRepresentative.value = representative;
    if (bankAccount) complianceBankAccount.value = bankAccount;
    if (signatory) complianceSignatory.value = signatory;
    if (agreement) complianceAgreement.value = agreement;

    // Update completion status when dependencies change
    updateCompletionStatus();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.content-block {
  .content-tab {
    @apply mb-6 flex justify-between items-start;

    &-item {
      @apply cursor-pointer w-1/2 text-center pb-2 border-b border-b-grey-200 text-grey-700/65 text-[14.75px];
    }

    &-item--active {
      @apply text-green-600 font-medium border-b-2 border-b-green-600;
    }
  }

  .section-block {
    @apply flex flex-col justify-start items-start gap-y-4;
  }
}
</style>
