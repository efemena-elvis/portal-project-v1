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
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";
import { useValidators, useEvents } from "@packages/hooks";
import { BulkUploadTable } from "@packages/uikit";
import { MerchantWrapper } from "@/modules/compliance/components";
import { useComplianceStore } from "@/modules/compliance/store";
import businessSectors from "@/modules/compliance/constants/business-sectors";

const router = useRouter();
const complianceStore = useComplianceStore();
const { validateRequired, validateEmail, validateTelephone, validateURL } =
  useValidators();

const { merchantDataComputed } = storeToRefs(complianceStore);
const {
  addMerchantData,
  removeMerchantData,
  updateMerchantData,
  transformMerchantData,
  onboardBulkMerchant,
} = complianceStore;

const stopClickHandler = ref(false);
const { processAPIRequest, pushToastAlert } = useEvents();

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
    name: "mcc",
    label: "Business category",
    type: "select",
    path: "profile.mcc",
    placeholder: "Select business category",
    options: [...businessSectors],
    validator: validateRequired,
  },
  {
    name: "email",
    label: "Email address",
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
    name: "website_link",
    label: "Website",
    type: "url",
    path: "profile.website_link",
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
      validateRequired(profile.mcc),
      validateEmail(profile.email),
      validateTelephone(profile.phone_number),
      validateURL(profile.website_link ?? ""),
    ];

    // If any validator returned a non-empty error string, form is not ready
    return validations.every((result) => result === "");
  });
});

const handleBusinessProfileUpdate = async () => {
  const transformedData = transformMerchantData(merchantDataComputed.value);

  const response = await processAPIRequest({
    action: onboardBulkMerchant,
    payload: {
      data: transformedData,
    },
  });

  stopClickHandler.value = true;

  if (response.code === 201) {
    router.push({ name: "AggregatorMerchantBusinessAddress" });
  } else {
    pushToastAlert({
      message: "Failed to update business profile. Please try again.",
      type: "error",
    });
  }
};

watch(
  merchantDataComputed,
  (newValue) => {
    if (newValue) {
      tableBody.value = newValue;
    }
  },
  { immediate: true }
);
</script>
