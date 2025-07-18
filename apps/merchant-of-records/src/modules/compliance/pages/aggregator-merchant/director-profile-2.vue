<template>
  <MerchantWrapper
    :stopClickHandler="stopClickHandler"
    :isPrimaryActionDisabled="!isActionReady"
    showActionRow
    @onBackClick="router.push({ name: 'AggregatorDirectorDetails1' })"
    @onContinueClick="handleBusinessDirectorUpdate"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { BulkUploadTableType, IMerchantBaseType } from "@packages/models";
import { useValidators, useEvents } from "@packages/hooks";
import { BulkUploadTable } from "@packages/uikit";
import { MerchantWrapper } from "@/modules/compliance/components";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";

const router = useRouter();

const { uploadFile, getBusinessCountries } = useGlobalStore();
const complianceStore = useComplianceStore();
const { validateRequired } = useValidators();
const { processAPIRequest } = useEvents();

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
    name: "legal_full_name",
    label: "Director Fullname",
    type: "text",
    path: "director2.legal_full_name",
    placeholder: "Enter director fullname",
    validator: validateRequired,
  },
  {
    name: "country_id",
    label: "Country of residence",
    type: "select",
    path: "director2.country_id",
    placeholder: "Select country",
    validator: validateRequired,
  },
  {
    name: "address",
    label: "Director Address",
    type: "text",
    path: "director2.address",
    placeholder: "Enter director address",
    validator: validateRequired,
  },
  {
    name: "doc_type",
    label: "Director ID Type",
    type: "select",
    path: "director2.doc_type",
    placeholder: "Select ID Type",
    options: [
      {
        value: "passport",
        name: "International Passport",
      },
      {
        value: "driving_license",
        name: "Driving License",
      },
      {
        value: "national_id",
        name: "National ID",
      },
      {
        value: "other",
        name: "Other",
      },
    ],
    validator: validateRequired,
  },
  {
    name: "doc_url",
    label: "Director ID",
    type: "file",
    path: "director2.doc_url",
    placeholder: "Upload Director ID",
    validator: validateRequired,
  },
]);

const tableBody = ref<IMerchantBaseType[]>(merchantDataComputed.value || []);

const isActionReady = computed(() => {
  return merchantDataComputed.value.every((item) => {
    const director2 = item.director2;

    const validations = [
      validateRequired(director2.legal_full_name),
      validateRequired(director2.country_id),
      validateRequired(director2.address),
      validateRequired(director2.doc_type),
      validateRequired(director2.doc_url),
    ];

    // If any validator returned a non-empty error string, form is not ready
    return validations.every((result) => result === "");
  });
});

const loadBusinessCountries = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const countries = response.data.map(
      (item: { id: string; name: string }) => ({
        value: item.id,
        name: item.name,
      })
    );

    tableHeader.value[2].options = countries;
  }
};

const handleBusinessDirectorUpdate = () => {
  router.push({ name: "AggregatorUboDetails1" });
};

// LOAD BUSINESS COUNTRIES
onMounted(() => loadBusinessCountries());
</script>
