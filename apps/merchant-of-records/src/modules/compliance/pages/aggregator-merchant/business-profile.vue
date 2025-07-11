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
      :uploadAction="uploadFile"
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
import { BulkUploadTable } from "@packages/uikit";
import { MerchantWrapper } from "@/modules/compliance/components";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";
import businessSectors from "@/modules/compliance/constants/business-sectors";

const router = useRouter();
const { uploadFile } = useGlobalStore();
const complianceStore = useComplianceStore();

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
  },
  {
    name: "sector",
    label: "Business sector",
    type: "select",
    path: "profile.sector",
    placeholder: "Select business sector",
    options: [...businessSectors],
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    path: "profile.email",
    placeholder: "Enter business email",
  },
  {
    name: "phone_number",
    label: "Phone number",
    type: "number",
    path: "profile.phone_number",
    placeholder: "Enter phone number",
  },
  {
    name: "website",
    label: "Website",
    type: "url",
    path: "profile.website",
    placeholder: "Enter business website",
  },
]);

const tableBody = ref<IMerchantBaseType[]>(merchantDataComputed.value || []);

const isActionReady = computed(() => {
  return merchantDataComputed.value.every((item) => {
    const { legal_name, sector, email, phone_number, website } = item.profile;

    // Return true if all fields are truthy (i.e., not empty)
    return !!(legal_name && sector && email && phone_number && website);
  });
});

const handleBusinessProfileUpdate = () => {
  router.push({ name: "AggregatorMerchantBusinessAddress" });
};
</script>
