<template>
  <MerchantWrapper
    :stopClickHandler="stopClickHandler"
    :isPrimaryActionDisabled="!isActionReady"
    showActionRow
    @onBackClick="router.push({ name: 'AggregatorMerchantBusinessAddress' })"
    @onContinueClick="handleBusinessDocumentUpdate"
  >
    <BulkUploadTable
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :showAddMerchantBtn="false"
      :showRemoveBtn="false"
      :uploadAction="uploadFile"
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
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";

const router = useRouter();

const { uploadFile } = useGlobalStore();
const complianceStore = useComplianceStore();
const { validateRequired } = useValidators();

const { merchantDataComputed } = storeToRefs(complianceStore);
const { updateMerchantData } = complianceStore;
const stopClickHandler = ref(false);

const tableHeader = ref<BulkUploadTableType[]>([
  {
    name: "legal_name",
    label: "Business name",
    type: "text",
    path: "profile.legal_name",
    placeholder: "Enter business name",
    readonly: true,
  },
  {
    name: "tax_number",
    label: "Tax number",
    type: "text",
    path: "documents.tax_number",
    placeholder: "Enter tax number",
    validator: validateRequired,
  },
  {
    name: "business_certificate_url",
    label: "Business registration",
    type: "file",
    path: "documents.business_certificate_url",
    placeholder: "Upload Registration",
    validator: validateRequired,
  },
  {
    name: "form_3_url",
    label: "Form 3",
    type: "file",
    path: "documents.form_3_url",
    placeholder: "Upload Form 3",
  },
]);

const tableBody = ref<IMerchantBaseType[]>(merchantDataComputed.value || []);

const isActionReady = computed(() => {
  return merchantDataComputed.value.every((item) => {
    const documents = item.documents;

    const validations = [
      validateRequired(documents.tax_number),
      validateRequired(documents.business_certificate_url),
    ];

    // If any validator returned a non-empty error string, form is not ready
    return validations.every((result) => result === "");
  });
});

const handleBusinessDocumentUpdate = () => {
  router.push({ name: "AggregatorDirectorDetails1" });
};
</script>
