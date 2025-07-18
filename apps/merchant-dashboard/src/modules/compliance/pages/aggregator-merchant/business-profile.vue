<template>
  <MerchantWrapper
    :stopClickHandler="stopClickHandler"
    :isPrimaryActionDisabled="!isActionReady"
    showActionRow
    @onBackClick="router.push({ name: 'VesicashOverview' })"
    @onContinueClick="handleBusinessProfileUpdate"
  >
    <BulkUploadTable
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      showAddMerchantBtn
      showRemoveBtn
      :addRowAction="addMerchantData"
      :removeRowAction="removeMerchantData"
      :updateMerchantAction="updateMerchantData"
    />
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";
import { useValidators } from "@packages/hooks";
import { BulkUploadTable } from "@packages/uikit";
import { MerchantWrapper } from "@/modules/compliance/components";
import { useComplianceStore } from "@/modules/compliance/store";
import businessSectors from "@/modules/compliance/constants/business-sectors";

const router = useRouter();
const complianceStore = useComplianceStore();
const { validateRequired, validateEmail, validateTelephone, validateURL } =
  useValidators();

const { merchantDataComputed } = storeToRefs(complianceStore);
const { addMerchantData, removeMerchantData, updateMerchantData } =
  complianceStore;
const stopClickHandler = ref(false);

const tableHeader = ref<BulkUploadTableType[]>([
  {
    name: "legal_name",
    label: "Business name",
    type: "text",
    path: "profile.legal_name",
    placeholder: "Enter business name",
    validator: validateRequired,
  },
  {
    name: "sector",
    label: "Business sector",
    type: "select",
    path: "profile.sector",
    placeholder: "Select business sector",
    options: [...businessSectors],
    validator: validateRequired,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    path: "profile.email",
    placeholder: "Enter business email",
    validator: validateEmail,
  },
  {
    name: "phone_number",
    label: "Phone number",
    type: "tel",
    path: "profile.phone_number",
    placeholder: "Enter phone number",
    validator: validateTelephone,
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    path: "profile.website",
    placeholder: "Enter business website",
    validator: validateURL,
  },
]);

const tableBody = ref<IMerchantBaseType[]>(merchantDataComputed.value || []);

const isActionReady = computed(() => {
  return merchantDataComputed.value.every((item) => {
    const profile = item.profile;

    const validations = [
      validateRequired(profile.legal_name),
      validateRequired(profile.sector),
      validateEmail(profile.email),
      validateTelephone(profile.phone_number),
      validateURL(profile.website ?? ""),
    ];

    // If any validator returned a non-empty error string, form is not ready
    return validations.every((result) => result === "");
  });
});

const handleBusinessProfileUpdate = () => {
  router.push({ name: "AggregatorMerchantBusinessAddress" });
};
</script>
